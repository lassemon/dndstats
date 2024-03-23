import { PageStatsResponse } from '@dmtool/application'
import { Box, Paper, PaperProps, Typography } from '@mui/material'
import { PageStatsService } from 'application/services/PageStatsService'
import LoadingIndicator from 'components/LoadingIndicator'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from 'assets/logo_grey.png'

const gap = '4em'
const spinDuration = '10s'

interface StatCardProp extends PaperProps {
  title: string
  amount: number
  loading: boolean
  onClick?: () => void
  disabled?: boolean
}

const StatCard: React.FC<StatCardProp> = ({ title, amount, loading, disabled, onClick, ...passProps }) => {
  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        display: 'flex',
        position: 'relative',
        containerType: 'size',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '26cqw',
        maxWidth: '20em',
        height: '26cqw',
        maxHeight: '20em',
        border: (theme) => `8px solid ${theme.palette.primary.dark}`,
        borderRadius: '20em',
        cursor: disabled ? 'default' : 'pointer',
        background: (theme) => theme.palette.primary.light,
        opacity: disabled ? '0.5' : '1',
        '&:hover': disabled
          ? {}
          : {
              border: '8px solid rgba(0,0,0,0.3)',
              background: (theme) => theme.palette.primary.dark
            }
      }}
      {...passProps}
    >
      <Typography variant="h5" sx={{ fontSize: '15cqw', textTransform: 'uppercase' }}>
        {title}
      </Typography>
      {loading ? (
        <LoadingIndicator
          progressProps={{
            thickness: 1,
            size: '105cqw',
            sx: {
              position: 'absolute',
              animationDuration: spinDuration,
              '& .MuiCircularProgress-circle': { animationDuration: spinDuration }
            }
          }}
          sx={{ position: 'absolute', alignItems: 'center', height: 'clamp(1em, 3vw, 4.8em)' }}
        />
      ) : (
        <Typography sx={{ fontSize: '15cqw', lineHeight: '1em' }}>{amount}</Typography>
      )}
    </Paper>
  )
}

const pageStatsService = new PageStatsService()

const FrontPage: React.FC = () => {
  const [loadingPageStats, setLoadingPageStats] = useState(false)
  const [pageStats, setPageStats] = useState<PageStatsResponse | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAndSetPageStats = async () => {
      try {
        setLoadingPageStats(true)
        const pageStatsResponse = await pageStatsService.getPageStats().finally(() => {
          setLoadingPageStats(false)
        })
        setPageStats(pageStatsResponse)
      } catch (error) {
        console.error('Failed to fetch page stats', error)
      }
    }

    fetchAndSetPageStats()
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 100%',
        minHeight: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: gap,
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '70%',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', gap: gap }}>
        <StatCard title="Items" amount={pageStats?.itemsCreated || 0} loading={loadingPageStats} onClick={() => navigate('/items')} />
        <StatCard title="Spells" amount={0} loading={false} disabled />
      </Box>
      <Box sx={{ display: 'flex', gap: gap }}>
        <StatCard title="Weapons" amount={0} loading={false} disabled />
        <StatCard title="Monsters" amount={0} loading={false} disabled />
      </Box>
    </Box>
  )
}

export default FrontPage
