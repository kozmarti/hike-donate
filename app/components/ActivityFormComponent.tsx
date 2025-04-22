import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { set, useForm } from "react-hook-form";
import "/styles/formstyle.css";
import { start } from "repl";
import { MapComponent } from "./MapComponent";
import { useMapEvent } from "react-leaflet";
import { get } from "http";
import { Activity } from "../api/user/[strava_user_id]/project/[project_slug]/activities/route";
import { aggregateData, dataAggregateWithConstant, deltaData, getCalculatedAltitudes, getDeltaDistances, getLastDistance, timeStringToSeconds, totalElevationGain, totalElevationLoss, transformData } from "../utils/calculation_functions_client";
import { UploadButton } from "../src/utils/uploadthing";
import "@uploadthing/react/styles.css";
import EditableImageComponent from "./EditableImageComponent";
import { onBeforeUploadBegin } from "../utils/resize_phot_helpers";

interface DataInputFromForm {
    coordinates: { latitude: string; longitude: string }[];
    photos: string[];
    start_time: Date;
    moving_time: string;
}

export interface DataOutputFromForm {
    coordinates: number[][];
    photos: string[];
    start_time: Date;
    moving_time: number;

}

export const ActivityFormComponent = () => {
    const [indexes, setIndexes] = useState<number[]>([]);
    const [counter, setCounter] = useState(0);
    const { register, unregister, handleSubmit, resetField, setValue, getValues } = useForm<DataInputFromForm>();
    const [files, setFiles] = useState<string[]>([]);
    const [coords, setCoords] = useState<number[][]>([]);
    const [centerLocation, setCenterLocation] = useState<[number, number]>([0, 0]);
    const [editableImages, setEditableImages] = useState<string[]>([]);


    const onSubmitForm = async (dataIn: DataInputFromForm) => {
        const coordsTransformed =
            dataIn.coordinates.map(({ latitude, longitude }) => [
                parseFloat(latitude),
                parseFloat(longitude)
            ])
            ;

        const dataOut: DataOutputFromForm = {
            coordinates: coordsTransformed,
            photos: dataIn.photos,
            start_time: dataIn.start_time,
            moving_time: timeStringToSeconds(dataIn.moving_time)
        }
        const altitudes = await getCalculatedAltitudes(dataOut.coordinates);
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

    const onClientUploadComplete = (res: any) => {
        // @ts-ignore
        console.log("New files: ", res.map(file => file.ufsUrl));
        setEditableImages((prevImages) => [
            ...prevImages,
            // @ts-ignore
            ...res.map(file => file.ufsUrl),
          ]);
        setFiles((prevFiles) => [
            ...prevFiles,
            // @ts-ignore
            ...res.map(file => file.ufsUrl),
          ]);
    }

    const OnUploadPhotoChange = (filesToUpload: any) => {
        console.log("Files changed:", filesToUpload);
    }

    const handleClearImage = (index: number) => {
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles];
          updatedFiles.splice(index, 1);  // Remove image at the given index
          return updatedFiles;
        });
        setEditableImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages.splice(index, 1);  // Remove image at the given index
          return updatedImages;
        }
        );
      };



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
    useEffect(() => {
        console.log("Updated coords:", coords);
    }, [coords]);


    useEffect(() => {
        setValue("photos", files);
        console.log("USEEFFECTForm photo urls updated:", files);
    }, [files]);

    useEffect(() => {
        const fetchLastActivity = async () => {
            const stravaUserId = parseInt(process.env.NEXT_PUBLIC_STRAVA_USER_ID || "0");
            const projectName = process.env.NEXT_PUBLIC_STRAVA_PROJECT_NAME || "";
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            const res = await fetch(`${apiUrl}/api/user/${stravaUserId}/project/${projectName}/activities`);
            const activities: Activity[] = await res.json();

            if (activities.length > 0) {
                const lastCoords = activities[activities.length - 1].coordinates;

                if (lastCoords.length > 0) {
                    const lastCoord = lastCoords[lastCoords.length - 1];
                    setCenterLocation([lastCoord[0], lastCoord[1]]);
                }
            }


        };

        fetchLastActivity();
    }, []);



    return (
        <>
            <form onSubmit={handleSubmit(onSubmitForm)}>
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
                <div className="data-label">
                    <div>Coordinates </div>
                    <p>Please add at least 10 coordinate points for good looking data </p>
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
                <EditableImageComponent imageUrls={editableImages} onClearImage={handleClearImage}/>
            <UploadButton
                endpoint="imageUploader"
                config={{
                    mode: "manual",
                }}
                onBeforeUploadBegin={onBeforeUploadBegin}
                onClientUploadComplete={onClientUploadComplete}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
                onChange={OnUploadPhotoChange}                
            />
                <input type="submit" />
            </form>




        </>
    );
}

