import React from 'react'
import Box from "@mui/material/Box";
import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({subsets: ['latin'] });

const images = [
    { src: "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 300, height: 100, date: "2023-09-01"  },
    { src: "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 100, height: 50, date: "2023-09-02"  },
    { src: "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 200, height: 400, date: "2023-09-03"  },

    { src: "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 150, height: 100, date: "2023-09-04"  },
    { src:  "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-05"  },
    { src:  "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-06"  },

    { src:  "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-07"  },

    { src:  "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-08"  },
    { src:  "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-09"  },
    { src:  "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-10"  },
    { src:  "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?q=80&w=3225&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", width: 400, height: 400, date: "2023-09-11"  },

  ];

export const PhotoAlbumComponent = () => {
    const { photos, columns, targetRowHeight, spacing, padding, width } = {
        photos: images,
        targetRowHeight: 200,
        width: 90,
        padding: 10,
        spacing: 10,
        columns: 3,
    };

  const calculatePadding = (containerWidth:number) => {
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

  const calculateSpacing = (containerWidth:number) => {
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

    const calculateColumn = (containerWidth:number) => {
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
      photos={photos}
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
            <div className={`${fredoka.className} photo-date`}>{photo.date}</div>
            ),
      }}
    />
  </Box>
  )
}

