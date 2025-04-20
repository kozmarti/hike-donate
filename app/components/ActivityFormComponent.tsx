import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import "/styles/formstyle.css";
import { start } from "repl";
import { MapComponent } from "./MapComponent";
import { useMapEvent } from "react-leaflet";
import { get } from "http";
import { Activity } from "../api/user/[strava_user_id]/project/[project_slug]/activities/route";

interface DataInput {
    coordinates: { latitude: string; longitude: string }[];
    photos: File[];
    start_time: Date;
    moving_time: string;
}

interface DataOutput {
    coordinates: number[][];
    photos: File[];
    start_time: Date;
    moving_time: number;

}


const transformData = (dataIn: DataOutput): Activity => {
    const activity: Activity = {
        strava_user_id: Number(process.env.STRAVA_USER_ID) ?? 0,
        strava_activity_id: 2,
        start_time: dataIn.start_time,
        strava_project_name: process.env.STRAVA_PROJECT_NAME ?? "",
        moving_time: dataIn.moving_time,

        total_distance: activity_strava["distance"],
        min_altitude: activity_strava["elev_low"],
        max_altitude: activity_strava["elev_high"],
        polyline: "",
    
        strava_photo_urls: photo_urls,
    
        coordinates: dataIn.coordinates,

        altitudes: streams_extracted["altitude"],
        distances: streams_extracted["distance"],
    
        delta_altitudes: delta_altitudes,
        delta_distances: delta_distances,
        total_elevation_loss: total_elevation_loss,
        total_elevation_gain: total_elevation_gain,
        distances_aggregated: delta_distances_aggregated,
      };
      return activity;
}

const getAltitudes = (coords: number[][]): number[] => {

}

export const ActivityFormComponent = () => {
    const [indexes, setIndexes] = useState<number[]>([]);
    const [counter, setCounter] = useState(0);
    const { register, unregister, handleSubmit, resetField, setValue, getValues } = useForm<DataInput>();
    const [files, setFiles] = useState<File[]>([]);
    const [coords, setCoords] = useState<number[][]>([]);



    const onSubmit = (dataIn: DataInput) => {
        const transformed = {
            coords: dataIn.coordinates.map(({ latitude, longitude }) => [
                parseFloat(latitude),
                parseFloat(longitude)
            ])
        };
        const dataOut: DataOutput = {
            coordinates: transformed.coords,
            photos: dataIn.photos,
            start_time: dataIn.start_time,
            moving_time: timeStringToSeconds(dataIn.moving_time)
        }
        console.log(dataOut);
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
                    // @ts-ignore
                    coordinates={coords}
                    clickedLocationAbled
                    onMapClick={(latlng) => {
                        if (indexes.length === 0) return;
                        const lastIndex = indexes[indexes.length - 1];
                        // @ts-ignore
                        setValue(`coords.${lastIndex}.latitude`, latlng[0].toString());
                        // @ts-ignore
                        setValue(`coords.${lastIndex}.longitude`, latlng[1].toString());
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
                                                console.log("HIIIII");
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

