import React, { useEffect, useState } from 'react'
import Box from "@mui/material/Box";
import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({ subsets: ['latin'] });

const imagesOld = [
  { src: "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 1, height: 1.4219576719576719, date: "2023-09-01" },
  { src: "https://plus.unsplash.com/premium_photo-1673240367277-e1d394465b56?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 100, height: 50, date: "2023-09-02" },
  { src: "https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 200, height: 400, date: "2023-09-03" },

  { src: "https://images.unsplash.com/photo-1502085671122-2d218cd434e6?q=80&w=1526&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 150, height: 100, date: "2023-09-04" },
  { src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-05" },
  { src: "https://images.unsplash.com/photo-1515310787031-25ac2d68610d?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-06" },

  { src: "https://plus.unsplash.com/premium_photo-1675629118861-dc8aa2acea74?q=80&w=1634&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-07" },

  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-08" },
  { src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-09" },
  { src: "https://plus.unsplash.com/premium_photo-1670428615389-7bf61172e1be?q=80&w=1550&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-10" },
  { src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-11" },

];


export const PhotoAlbumComponent = () => {
  const [images, setImages] = useState([]);
  const imageUrls = [
    "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673240367277-e1d394465b56?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1502085671122-2d218cd434e6?q=80&w=1526&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1515310787031-25ac2d68610d?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675629118861-dc8aa2acea74?q=80&w=1634&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1670428615389-7bf61172e1be?q=80&w=1550&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  const aspectRatio = (height: number, width: number) => {
    if (height > width) {
      return { width: 1, height: height / width }
    } else {
      return { height: 1, width: width / height }
    }
  }

  const photosForGallery = async (imgArr: string[]) => {
    const loadImage = (src: string): Promise<any> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          const aspect = aspectRatio(img.height, img.width);
          resolve({
            src,
            width: aspect.width,
            height: aspect.height,
            date: "2023-09-11",
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

