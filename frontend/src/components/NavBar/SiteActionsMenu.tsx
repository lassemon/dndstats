import { Box, Button, Tooltip, Typography } from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import PrintIcon from '@mui/icons-material/Print'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { LocalStorageRepository } from 'infrastructure/repositories/LocalStorageRepository'
import { Link } from 'react-router-dom'

const localStorageRepository = new LocalStorageRepository<any>()

export const SiteActionsMenu: React.FC = () => {
  const _printDefer = () => {
    setTimeout(window.print, 100)
  }

  const onPrint = () => {
    _printDefer()
    return false
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        margin: '0 0 1em 0'
      }}
    >
      <Tooltip
        disableInteractive
        title={
          <>
            <Typography variant="h6" sx={{ color: 'white' }}>
              WARNING!
            </Typography>
            <Typography variant="body1">Resets everything in ALL VIEWS to default values</Typography>
          </>
        }
        placement="top-end"
      >
        <Button
          onClick={async () => {
            await localStorageRepository.clearAll()
            window.location.reload()
          }}
          sx={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5em' }}
        >
          Reset All <RestartAltIcon />
        </Button>
      </Tooltip>
      <Button onClick={onPrint} sx={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5em' }}>
        Print page <PrintIcon />
      </Button>
      <Button sx={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5em' }}>
        <Link to="/about" style={{ color: 'inherit', textDecoration: 'inherit' }}>
          About
        </Link>
        <InfoIcon />
      </Button>
    </Box>
  )
}

export default SiteActionsMenu
