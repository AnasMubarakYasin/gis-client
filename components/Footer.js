import { useTheme } from '@mui/material/styles';

function Footer(props) {
  const theme = useTheme();

  return (
    <footer style={{
      display: 'grid',
      placeContent: 'center',
      placeItems: 'center',
      background: theme.palette.background.paper,
    }}>
      <p>Copyright &copy; 2022 Bladerlaiga, All Right Reserved.</p>
    </footer>
  )
}

export default Footer
