import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "/styles/formstyle.css";
import { MapComponent } from "./MapComponent";
import { getCalculatedAltitudes, getLastDistance, timeStringToSeconds, transformData } from "../utils/calculation_functions_client";
import { UploadButton } from "../src/utils/uploadthing";
import "@uploadthing/react/styles.css";
import EditableImageComponent from "./EditableImageComponent";
import { onBeforeUploadBegin } from "../utils/resize_photo_helpers";
import { useRouter } from "next/navigation";
import { LatLngExpression } from "leaflet";
import { useActivities } from "../hooks/useActivities";
import { Activity } from "../entities/Activity";
import { createActivity } from "../services/activity-api";


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
    const router = useRouter();
    const [clickedLocation, setClickedLocation] = useState<LatLngExpression | null>(null);
    const [lastActivityDate, setLastActivityDate] = useState<string | null>(null);


 


    const onSubmitForm = async (dataIn: DataInputFromForm) => {
        try {
            const dataOut: DataOutputFromForm = {
                coordinates: coords,
                photos: dataIn.photos,
                start_time: dataIn.start_time,
                moving_time: timeStringToSeconds(dataIn.moving_time)
            }
            const altitudes = await getCalculatedAltitudes(dataOut.coordinates);

            const last_distance = await getLastDistance(dataOut.start_time.toString());
            const final_data = transformData(dataOut, altitudes, last_distance);

            const res = await createActivity(final_data);
            console.log("Activity post response:", res);
            router.push("/");
        }
        catch (error) {
            console.error("Error submitting form:", error);
        }

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
        console.log(counter);
        if ((counter) && Number(getValues(`coordinates.${counter - 1}.longitude`)) == 0 || Number(getValues(`coordinates.${counter - 1}.latitude`)) == 0) {
            alert("Please fill the last coordinate before adding a new one");
            return;
        }
        setIndexes(prevIndexes => [...prevIndexes, counter]);
        setCounter(prevCounter => prevCounter + 1);
    };
    const clearCoords = () => {
        setIndexes([]);
        resetField("coordinates");
        setCounter(0);
        setClickedLocation(null);
        setCoords([centerLocation]);
    };
    useEffect(() => {
        console.log("Updated coords:", coords);
    }, [coords]);


    useEffect(() => {
        setValue("photos", files);
    }, [files]);

    useEffect(() => {
        const fetchLastActivity = async () => {
            const activities: Activity[] = await useActivities();            
            if (activities.length > 0) {
                const lastActivity = activities[activities.length - 1]
                const lastCoords = lastActivity.coordinates;
                setLastActivityDate(lastActivity.start_time.toString());
                if (lastCoords.length > 0) {
                    const lastCoord = lastCoords[lastCoords.length - 1];
                    setCenterLocation([lastCoord[0], lastCoord[1]]);
                    setCoords([lastCoord]);
                }
            }
        };
        fetchLastActivity();

    }, []);



    return (
        <>
            <h1 className="activity-header">Add new activity</h1>
            <form onSubmit={handleSubmit(onSubmitForm)}>


                <label className="data-label">
                    <p className="warning-form-text">Last activity date : {lastActivityDate}</p>
                    Start Date and Time:
                    <input
                        required
                        type="datetime-local"
                        {...register("start_time")}
                        value={lastActivityDate ? lastActivityDate : new Date().toISOString().slice(0, 16)}
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

                    <MapComponent
                        startIconPinSize={[40, 40]}
                        clickedLocation={clickedLocation}
                        pinIconUrl={"./map-pin.png"}
                        currentLocation={centerLocation}
                        // @ts-ignore
                        coordinates={coords}
                        clickedLocationAbled
                        onMapClick={(latlng) => {
                            setClickedLocation(latlng);
                            if (indexes.length === 0) return;
                            const lastIndex = indexes[indexes.length - 1];
                            // @ts-ignore
                            setValue(`coordinates.${lastIndex}.latitude`, latlng[0].toString());
                            // @ts-ignore
                            setValue(`coordinates.${lastIndex}.longitude`, latlng[1].toString());
                            const coordinates = getValues("coordinates");
                            console.log("coords", coordinates);
                            setCoords([centerLocation,
                                ...coordinates.map((c) => [
                                    parseFloat(c.latitude),
                                    parseFloat(c.longitude)
                                ])]);
                            console.log("coords", coordinates);
                        }}
                    />
                    <p className="p-5 warning-form-text">Please add at least 10 coordinate points for good looking data </p>
                    <div className="coords-container">
                        {coords.length > 0 && (
                            <fieldset className="bg-gray-200 p-2 m-2 rounded-md">
                                 Starting points
                                <label>
                                    Latitude:
                                    <input
                                        type="text"
                                        step="any"
                                        value={coords[0][0]}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Longitude:
                                    <input
                                        type="text"
                                        step="any"
                                        value={coords[0][1]}
                                        readOnly
                                    />
                                </label>
                            </fieldset>
                        )}
                        {indexes.map(index => {
                            const fieldCoord = `coords[${index}]`;
                            return (
                                <fieldset name={fieldCoord} key={fieldCoord} className="p-2 m-2">
                                    {getValues(`coordinates.${index}.longitude`) == undefined && <p>Click on the map</p>}
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
                                                    setCoords([centerLocation,
                                                        ...coordinates.map((c) => [
                                                            parseFloat(c.latitude),
                                                            parseFloat(c.longitude)
                                                        ])]);
                                                    setClickedLocation([
                                                        parseFloat(getValues(`coordinates.${index}.latitude`)),
                                                        parseFloat(getValues(`coordinates.${index}.longitude`))
                                                    ]);
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
                                                    setCoords([centerLocation,
                                                        ...coordinates.map((c) => [
                                                            parseFloat(c.latitude),
                                                            parseFloat(c.longitude)
                                                        ])]);
                                                    setClickedLocation([
                                                        parseFloat(getValues(`coordinates.${index}.latitude`)),
                                                        parseFloat(getValues(`coordinates.${index}.longitude`))
                                                    ]);
                                                }
                                            }
                                            }
                                        />
                                    </label>
                                </fieldset>
                            );
                        })}
                        <button className="adds-button m-5" type="button" onClick={addCoord}>
                            +
                        </button>
                    </div>


                    <button className="warn-button" type="button" onClick={clearCoords}>
                        Clear Coords
                    </button>
                </div>
                <EditableImageComponent imageUrls={editableImages} onClearImage={handleClearImage} />
                <UploadButton
                    endpoint="imageUploader"
                    // config={{
                    //mode: "manual",
                    //}}
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

