import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const LazyPhoto = ({ src, date, ...props }: { src: string; date?: string }) => {
  const [inViewRef, inView] = useInView({ triggerOnce: true });
  const [loaded, setLoaded] = useState(false);

  return (
      <div ref={inViewRef} style={{ marginBottom: "-25px"}}>
        {inView && (
          <>
              <img
                {...props}
                src={src}
                alt={"photo of" + date}
                loading="lazy"
                style={{
                  // @ts-ignore
                  ...props.style,
                  opacity: loaded ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                  padding: "20px", paddingBottom: "40px", backgroundColor: "rgba(255, 255, 255, 0.5)", borderRadius: "4px", boxShadow: "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
              
                }}
                onLoad={() => setLoaded(true)}
              />
            <div style={{position: "relative", top: "-35px", right: "30px", overflow: "visible"}} className={`photo-date`}>{date}</div>
          </>
        )}
      </div>
  );
};

export default LazyPhoto;