import { Box } from '@mui/material';
import { Fredoka } from 'next/font/google';
import { FaHeart } from "react-icons/fa";


const fredoka = Fredoka({ subsets: ['latin'] });


const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'right',
        padding: '20px',
        marginTop: 'auto',
        color: '#444',
        fontSize: '14px',
        fontFamily: fredoka.style.fontFamily,
      }}
    >
        <div>Developed with <FaHeart style={{display: "inline"}} color='#fd5770' /> by Marta 
        </div>
    </Box>
  );
};

export default Footer;