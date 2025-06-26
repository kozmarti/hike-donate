import React, { useEffect, useState } from 'react'
import Box from "@mui/material/Box";
import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'] });

interface Photo {
  src: string;
  date: string;
}
interface PhotoAlbumProps {
  photos: Photo[];
}

export const PhotoAlbumComponent = ({photos: imageUrls}: PhotoAlbumProps) => {
  const [images, setImages] = useState([]);

  const aspectRatio = (height: number, width: number) => {
    if (height > width) {
      return { width: 1, height: height / width }
    } else {
      return { height: 1, width: width / height }
    }
  }

  const photosForGallery = async (imgArr: Photo[]) => {
    const loadImage = (photo: Photo): Promise<any> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = photo.src;
        img.onload = () => {
          const aspect = aspectRatio(img.height, img.width);
          resolve({
            src: photo.src,
            width: aspect.width,
            height: aspect.height,
            date: photo.date,
          });
        };
        img.onerror = () => resolve(null); // skip if failed to load
      });
    };
  
    const imagePromises = imgArr.map(loadImage);
    const loadedImages = await Promise.all(imagePromises);
    return loadedImages.filter(Boolean); // remove any failed ones
  };

  /* when photos is passed into the component run the function and update the state */
  useEffect(() => {
    console.log("Received imageUrls:", imageUrls);
    const loadImages = async () => {
      const galleryImages = await photosForGallery(imageUrls);
      // @ts-ignore
      setImages(galleryImages);

    };
    loadImages();

  }, []);

  const { photos, columns, targetRowHeight, spacing, padding, width } = {
    photos: images,
    targetRowHeight: 200,
    width: 90,
    padding: 10,
    spacing: 10,
    columns: 3,
  };

  const calculatePadding = (containerWidth: number) => {
    if (containerWidth < 480) {
      return 5;
    } else if (containerWidth < 768) {
      return 15;
    } else if (containerWidth < 1024) {
      return 20;
    } else {
      return 30;
    }
  };

  const calculateSpacing = (containerWidth: number) => {
    if (containerWidth < 480) {
      return 10;
    } else if (containerWidth < 768) {
      return 10;
    } else if (containerWidth < 1024) {
      return 15;
    } else {
      return 20;
    }
  };

  const calculateColumn = (containerWidth: number) => {
    if (containerWidth < 480) {
      return 1;
    } else if (containerWidth < 768) {
      return 2;
    } else {
      return 3;
    }
  };

  return (
    <Box sx={{ width: `${width}%`, mx: "auto", paddingTop: 5 }}>
      <PhotoAlbum
        photos={images}
        layout="masonry"
        columns={calculateColumn}
        spacing={calculateSpacing}
        padding={calculatePadding}
        render={{
          wrapper: ({ style, ...rest }) => (
            <div
              style={{
                ...style,
                borderRadius: padding > 2 ? "4px" : 0,
                boxShadow:
                  spacing + padding > 0
                    ? "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)"
                    : "none",
                transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
              }}
              {...rest}
            />
          ),
          extras: (_, { photo, index }) => (
            // @ts-ignore
            <div className={`${fredoka.className} photo-date`}>{photo.date}</div>
          ),
        }}
      />
    </Box>
  )
}

