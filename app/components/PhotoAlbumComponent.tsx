import React, { useEffect, useState,useRef, useCallback  } from 'react'
import Box from "@mui/material/Box";
import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import { Fredoka } from 'next/font/google';
import LazyPhoto from './LazyPhoto';
import { useInView } from 'react-intersection-observer';


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
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const cache = useRef<Map<string, any>>(new Map());

  const aspectRatio = (height: number, width: number) => {
    if (height > width) {
      return { width: 1, height: height / width }
    } else {
      return { height: 1, width: width / height }
    }
  }

  const photosForGallery = async (imgArr: Photo[]) => {
    console.log("HEREEEE", imgArr.length)
    const subset = imgArr.slice(0, visibleCount);
    console.log("visible count", visibleCount)  
    console.log("SLICEEED", subset.length)

    const loadImage = (photo: Photo): Promise<any> => {
      const cached = cache.current.get(photo.src); 
      console.log("already chached", cached)
      if (cached) return Promise.resolve(cached); 
      return new Promise((resolve) => {
        const img = new Image();
        img.src = photo.src;
        img.onload = () => {
          const aspect = aspectRatio(img.height, img.width);
          const result = {
            src: photo.src,
            width: aspect.width,
            height: aspect.height,
            date: photo.date,
            key: photo.src
          };
          console.log("not cached", result)
          cache.current.set(photo.src, result);
          resolve(result);
        };
        img.onerror = () => resolve(null); // skip if failed to load
      });
    };

  
    const imagePromises = subset.map(loadImage);  
    const loadedImages = await Promise.all(imagePromises);
    return loadedImages.filter(Boolean); // remove any failed ones
  };

  /* when photos is passed into the component run the function and update the state */
  useEffect(() => {
    console.log("Received imageUrls:", imageUrls);
    const loadImages = async () => {
      setIsLoading(true);
      const galleryImages = await photosForGallery(imageUrls);
      setIsLoading(false);
      // @ts-ignore
      setImages(galleryImages);

    };
    loadImages();

  }, [visibleCount]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 10);
  }, []);

  const { ref: bottomRef, inView } = useInView({
    threshold: 0.1,
  }); 

  useEffect(() => {
    console.log("ISVISIBLE TRIGEGRED")
    if (inView && visibleCount < imageUrls.length) loadMore();
  }, [inView, loadMore]);

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
          photo: (_, { photo, index } ) => (
            <LazyPhoto key={'photo' + index} src={photo.src} date={photo.date}>
            </LazyPhoto>
          ),
        }}
      />
      {isLoading && (
        <div style={{ textAlign: "center", padding: 20 }}>
          LOADING...
        </div>
      )}
      
      <div ref={bottomRef} style={{ height: 1 }} />
    </Box>
  )
}

