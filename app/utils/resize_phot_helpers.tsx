import Resizer from "react-image-file-resizer";

export const resizeFile = (file: File) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                500,
                500,
                "JPEG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });

export const onBeforeUploadBegin = async (files: File[]): Promise<File[]> => {
        try {
            console.log("Files before resizing:", files);
            const resizedFiles = await Promise.all(
                files.map((file) => resizeFile(file) as Promise<File>)
            );
            console.log("Files after resizing:", resizedFiles);
            return resizedFiles as File[];
        } catch (err) {
            console.error(err);
            return files; // Return the original files in case of an error
        }
    };