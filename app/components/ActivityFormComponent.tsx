import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import "/styles/formstyle.css";
import { start } from "repl";
import { MapComponent } from "./MapComponent";
import { useMapEvent } from "react-leaflet";
import { get } from "http";
import { Activity } from "../api/user/[strava_user_id]/project/[project_slug]/activities/route";
import { aggregateData, dataAggregateWithConstant, deltaData, getDeltaDistances, getLastDistance, totalElevationGain, totalElevationLoss } from "../utils/calculation_functions_client";

interface DataInputFromForm {
    coordinates: { latitude: string; longitude: string }[];
    photos: File[];
    start_time: Date;
    moving_time: string;
}

interface DataOutputFromForm {
    coordinates: number[][];
    photos: string[];
    start_time: Date;
    moving_time: number;

}


const transformData = (dataIn: DataOutputFromForm, altitudes: number[], last_distance: number): Activity => {
    const delta_altitudes = deltaData(altitudes);
    const total_elevation_gain = totalElevationGain(delta_altitudes);
    const total_elevation_loss = totalElevationLoss(delta_altitudes);
    const delta_distances = getDeltaDistances(dataIn.coordinates);
    const distances = aggregateData(delta_distances)
    const delta_distances_aggregated = dataAggregateWithConstant(distances, last_distance);

    const activity: Activity = {
        strava_user_id: 147153150,
        strava_activity_id: Number(Date.now()),
        start_time: dataIn.start_time,
        strava_project_name: "test",
        moving_time: dataIn.moving_time,
        total_distance: Math.max(...distances),
        min_altitude: Math.min(...altitudes),
        max_altitude: Math.max(...altitudes),
        polyline: "",
        strava_photo_urls: dataIn.photos,
        coordinates: dataIn.coordinates,
        altitudes: altitudes,
        distances: distances,
        delta_altitudes: delta_altitudes,
        delta_distances: delta_distances,
        total_elevation_loss: total_elevation_loss,
        total_elevation_gain: total_elevation_gain,
        distances_aggregated: delta_distances_aggregated,
    };
    return activity;
}

const getAltitudes = async (coords: number[][]): Promise<number[]> => {
    const altitudePromises = coords.map(async ([lat, lng]) => {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`);
            const data = await response.json();
            return data.elevation;
        } catch (error) {
            console.error("Error fetching altitude:", error);
            return null;
        }
    });

    const altitudes = await Promise.all(altitudePromises);
    return altitudes;
};

export const ActivityFormComponent = () => {
    const [indexes, setIndexes] = useState<number[]>([]);
    const [counter, setCounter] = useState(0);
    const { register, unregister, handleSubmit, resetField, setValue, getValues } = useForm<DataInputFromForm>();
    const [files, setFiles] = useState<File[]>([]);
    const [coords, setCoords] = useState<number[][]>([]);
    const [centerLocation, setCenterLocation] = useState<[number, number]>([0, 0]);


    const handleUpload = async (file: File) => {
        if (!file) return;
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
    
          const result = await res.json();
          if (res.ok) {
            console.log(result);
            return result.UploadedFileName;
          } else {
          }
        } catch (err) {
          console.error(err);
          return null;
        }
      };

    const onSubmit = async (dataIn: DataInputFromForm) => {
        const coordsTransformed = 
            dataIn.coordinates.map(({ latitude, longitude }) => [
                parseFloat(latitude),
                parseFloat(longitude)
            ])
        ;
        
        let photos: string[] = [];

        if (dataIn.photos && dataIn.photos.length > 0) {
            photos = await Promise.all(
              dataIn.photos.map(async (file) => {
                const fileName = await handleUpload(file);
                console.log("File uploaded:", fileName);
                return "uploads/" + fileName;
              })
            );
          }
        const dataOut: DataOutputFromForm = {
            coordinates: coordsTransformed,
            photos: photos,
            start_time: dataIn.start_time,
            moving_time: timeStringToSeconds(dataIn.moving_time)
        }
        const altitudes = await getAltitudes(dataOut.coordinates);
        const stravaUserId = parseInt(process.env.NEXT_PUBLIC_STRAVA_USER_ID || "0");
        const projectName = process.env.NEXT_PUBLIC_STRAVA_PROJECT_NAME || "";

        const last_distance = await getLastDistance(dataOut.start_time.toString(), stravaUserId, projectName);
        const final_data = transformData(dataOut, altitudes, last_distance);

        
        const res = await fetch(
            `/api/user/${stravaUserId}/project/${projectName}/activities`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(final_data)
            }
           


        );
        const responseJson = await res.json();
        console.log("Activity post response:", responseJson);

    };

    function timeStringToSeconds(timeStr: string): number {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 3600 + minutes * 60;
    }

    const addCoord = () => {
        setIndexes(prevIndexes => [...prevIndexes, counter]);
        setCounter(prevCounter => prevCounter + 1);
    };

    const removeCoord = (index: number) => () => {
        setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
        setCounter(prevCounter => prevCounter - 1);
        unregister(`coordinates.${index}`);

    };

    const clearCoords = () => {
        setIndexes([]);
        resetField("coordinates");
        setCounter(0);
        setCoords([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    useEffect(() => {
        console.log("Updated coords:", coords);
    }, [coords]);

    useEffect(() => {
        const fetchLastActivity = async () => {
          const stravaUserId = parseInt(process.env.NEXT_PUBLIC_STRAVA_USER_ID || "0");
          const projectName = process.env.NEXT_PUBLIC_STRAVA_PROJECT_NAME || "";
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
          const res = await fetch(`${apiUrl}/api/user/${stravaUserId}/project/${projectName}/activities`);
          const activities: Activity[] = await res.json();
      
          if (activities.length > 0) {
            const lastCoords = activities[activities.length -1].coordinates;

            if (lastCoords.length > 0) {
                const lastCoord = lastCoords[lastCoords.length - 1];
                setCenterLocation([lastCoord[0], lastCoord[1]]); 
              }
            }
             
          
        };
      
        fetchLastActivity();
      }, []);
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label className="data-label">
                Start Date and Time:
                <input
                    required
                    type="datetime-local"
                    {...register("start_time")}
                />
            </label>
            <label className="data-label">
                Duration:
                <input
                    required
                    type="time"
                    step="60" // allows minute precision (defaults to seconds)
                    {...register("moving_time")}
                />
            </label>
            <label className="data-label">
                Photos:
                <div>
                    {files.map((_, index) => (
                        <div key={index}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    handleFileChange(e);
                                    if (e.target.files) {
                                        setValue(`photos.${index}`, e.target.files[0]);
                                    }
                                }}
                            />
                        </div>
                    ))}
                    <button className="adds-button" type="button" onClick={() => setFiles((prevFiles) => [...prevFiles, new File([], "placeholder")])}>
                        Add Another Photo
                    </button>
                    <p>Not required</p>
                </div>
            </label>
            <div className="data-label">
                <div>Coordinates </div>
                <p>Please add at least 10 coordinate points</p>
                <MapComponent
                    currentLocation={centerLocation}
                    // @ts-ignore
                    coordinates={coords}
                    clickedLocationAbled
                    onMapClick={(latlng) => {
                        if (indexes.length === 0) return;
                        const lastIndex = indexes[indexes.length - 1];
                        // @ts-ignore
                        setValue(`coordinates.${lastIndex}.latitude`, latlng[0].toString());
                        // @ts-ignore
                        setValue(`coordinates.${lastIndex}.longitude`, latlng[1].toString());
                        const coordinates = getValues("coordinates");
                        console.log("coords", coordinates);
                        setCoords(coordinates.map((c) => [
                            parseFloat(c.latitude),
                            parseFloat(c.longitude)
                        ]));
                        console.log("coords", coordinates);
                    }}
                />

                <div className="coords-container">
                    {indexes.map(index => {
                        const fieldCoord = `coords[${index}]`;
                        return (
                            <fieldset name={fieldCoord} key={fieldCoord}>
                                <label>
                                    Latitude {index}:
                                    <input
                                        required
                                        type="number"
                                        step="any"
                                        min="-90"
                                        max="90"

                                        {...register(`coordinates.${index}.latitude`)}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            if (!isNaN(value) && Number(getValues(`coordinates.${index}.longitude`)) !== 0) {
                                                setValue(`coordinates.${index}.latitude`, value.toString());
                                                const coordinates = getValues("coordinates");
                                                setCoords(coordinates.map((c) => [
                                                    parseFloat(c.latitude),
                                                    parseFloat(c.longitude)
                                                ]));
                                            }
                                        }
                                        }
                                    />
                                </label>

                                <label>
                                    Longitude {index}:
                                    <input
                                        required
                                        type="number"
                                        step="any"
                                        min="-180"
                                        max="180"
                                        {...register(`coordinates.${index}.longitude`)}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            console.log(Number(getValues(`coordinates.${index}.latitude`)));
                                            if (!isNaN(value) && Number(getValues(`coordinates.${index}.latitude`)) !== 0) {
                                                console.log(Number(getValues(`coordinates.${index}.latitude`)));
                                                setValue(`coordinates.${index}.longitude`, value.toString());
                                                const coordinates = getValues("coordinates");
                                                setCoords(coordinates.map((c) => [
                                                    parseFloat(c.latitude),
                                                    parseFloat(c.longitude)
                                                ]));
                                            }
                                        }
                                        }
                                    />
                                </label>
                                <button className="warn-button" type="button" onClick={removeCoord(index)}>
                                    Remove
                                </button>
                            </fieldset>
                        );
                    })}
                </div>

                <button className="adds-button" type="button" onClick={addCoord}>
                    Add Coord
                </button>
                <button className="warn-button" type="button" onClick={clearCoords}>
                    Clear Coords
                </button>
            </div>



            <input type="submit" />
        </form>
    );
}

