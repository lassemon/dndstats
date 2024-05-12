import { Box, Button, Tooltip, Typography } from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import PrintIcon from '@mui/icons-material/Print'
import { LocalStorageRepository } from 'infrastructure/repositories/LocalStorageRepository'

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
        left: '0.5em',
        top: '0.5em'
      }}
    >
      <Tooltip
        disableInteractive
        title={
          <>
            <Typography variant="h6">WARNING!</Typography>
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
          style={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5em' }}
        >
          Reset All <RestartAltIcon />
        </Button>
      </Tooltip>
      <Button onClick={onPrint} style={{ whiteSpace: 'nowrap', display: 'flex', gap: '0.5em' }}>
        Print page <PrintIcon />
      </Button>
    </Box>
  )
}

export default SiteActionsMenu
