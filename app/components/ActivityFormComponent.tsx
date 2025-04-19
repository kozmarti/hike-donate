import { useState } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import "/styles/formstyle.css";
import { start } from "repl";
import { MapComponent } from "./MapComponent";
import { useMapEvent } from "react-leaflet";
import { get } from "http";

interface DataInput {
    coords: { latitude: string; longitude: string }[];
    photos: File[];
    startDate: string;
}

interface DataOutput {
    coords: number[][];
    photos: File[];
    startDate: string;

}




export const ActivityFormComponent = () => {
    const [indexes, setIndexes] = useState<number[]>([]);
    const [counter, setCounter] = useState(0);
    const { register, unregister, handleSubmit, resetField, setValue, getValues} = useForm<DataInput>();
    const [files, setFiles] = useState<File[]>([]); // To keep track of uploaded files


    const onSubmit = (dataIn: DataInput) => {
        const transformed = {
            coords: dataIn.coords.map(({ latitude, longitude }) => [
                parseFloat(latitude),
                parseFloat(longitude)
            ])
        };
        const dataOut: DataOutput = {
            coords: transformed.coords,
            photos: dataIn.photos,
            startDate: dataIn.startDate
        }
        console.log(dataOut);
    };

    const addCoord = () => {
        setIndexes(prevIndexes => [...prevIndexes, counter]);
        setCounter(prevCounter => prevCounter + 1);
    };

    const removeCoord = (index: number) => () => {
        setIndexes(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
        setCounter(prevCounter => prevCounter - 1);
        unregister(`coords.${index}`);
        
    };

    const clearCoords = () => {
        setIndexes([]);
        resetField("coords");
        setCounter(0);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                Start Date and Time:
                <input
                    type="datetime-local"
                    {...register("startDate")}
                />
            </label>
            <label>
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
                    <button type="button" onClick={() => setFiles((prevFiles) => [...prevFiles, new File([], "placeholder")])}>
                        Add Another Photo
                    </button>
                </div>
            </label>
            {indexes.map(index => {
                const fieldCoord = `coords[${index}]`;
                return (
                    <fieldset name={fieldCoord} key={fieldCoord}>
                        <label>
                            Latitude {index}:
                            <input
                                type="number"
                                step="any"
                                min="-90"
                                max="90"

                                {...register(`${fieldCoord}.latitude`)}
                            />
                        </label>

                        <label>
                            Longitude {index}:
                            <input
                                type="number"
                                step="any"
                                min="-180"
                                max="180"
                                {...register(`${fieldCoord}.longitude`)}
                            />
                        </label>
                        <button type="button" onClick={removeCoord(index)}>
                            Remove
                        </button>
                    </fieldset>
                );
            })}
            <MapComponent
                clickedLocationAbled
                onMapClick={(latlng) => {
                    if (indexes.length === 0) return;

                    const lastIndex = indexes[indexes.length - 1];
                    setValue(`coords.${lastIndex}.latitude`, latlng[0].toString());
                    setValue(`coords.${lastIndex}.longitude`, latlng[1].toString());
                }}
            />


            <button type="button" onClick={addCoord}>
                Add Coord
            </button>
            <button type="button" onClick={clearCoords}>
                Clear Coords
            </button>


            <input type="submit" />
        </form>
    );
}

