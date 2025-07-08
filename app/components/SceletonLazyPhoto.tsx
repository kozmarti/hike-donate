import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

interface Props {
  sceletonCount: number;
}

const SceletonLazyPhoto = ({ sceletonCount }: Props) => {
  return (
    <Box
      className="sceleton-container"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',

      }}
    >
      {Array.from({ length: sceletonCount }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
            width: '100%',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '4px',
            marginBottom: '20px',
            boxShadow:
              '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={150}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2,
           }}>
            <Skeleton
              animation="wave"
              height={20}
              width="40%"
              variant="text"
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default SceletonLazyPhoto;