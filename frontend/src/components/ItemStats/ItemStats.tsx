import React, { useState } from 'react'
import _ from 'lodash'

import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { ImageDTO, ItemDTO } from '@dmtool/application'
import ItemCard from 'components/ItemCard'
import { dateStringFromUnixTime } from '@dmtool/common'
import { useAtom } from 'jotai'
import { authAtom } from 'infrastructure/dataAccess/atoms'

interface ItemStatsProps {
  item: ItemDTO | null
  image?: ImageDTO | null
  loadingItem: boolean
  savingItem: boolean
  loadingImage: boolean
  showSecondaryCategories: boolean
  hideBgBrush?: boolean
  screenshotMode?: boolean
}

export const ItemStats: React.FC<ItemStatsProps> = ({
  item,
  loadingItem,
  savingItem,
  image,
  loadingImage,
  showSecondaryCategories,
  hideBgBrush = false,
  screenshotMode = false
}) => {
  const [inlineFeatures, setInlineFeatures] = useState(false)
  const [authState] = useAtom(authAtom)

  const onChangeInlineFeatures = () => {
    setInlineFeatures((_inlineFeatures) => !_inlineFeatures)
  }

  if (!item) {
    return null
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: '1em', width: 'fit-content', margin: '0 auto' }}>
      <ItemCard
        item={item}
        loadingItem={loadingItem}
        image={image}
        loadingImage={loadingImage}
        savingItem={savingItem}
        showSecondaryCategories={showSecondaryCategories}
        hideBgBrush={hideBgBrush}
        inlineFeatures={inlineFeatures}
      />
      <Box displayPrint="none">
        {(item.updatedAt || item.createdByUserName) && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              margin: '0 auto',
              visibility: screenshotMode ? 'hidden' : 'visible'
            }}
          >
            {item.createdByUserName && (
              <Typography variant="body2">
                Created by: <span style={{ fontWeight: '600' }}>{item.getCreatedByUserName(authState.user?.id)}</span>
              </Typography>
            )}
            <Box sx={{ display: 'flex', margin: '0 0 0 1em' }}>
              {item.getSource(authState.user?.id) && (
                <Typography variant="body2">
                  Source:{' '}
                  <Typography variant="caption" color="secondary" sx={{ margin: '0 1em 0 0', fontWeight: '600' }}>
                    {item.getSource(authState.user?.id)}
                  </Typography>
                </Typography>
              )}
              {item.updatedAt && (
                <Typography variant="body2">
                  Last updated: <span>{dateStringFromUnixTime(item.updatedAt)}</span>
                </Typography>
              )}
            </Box>
          </div>
        )}
        <FormGroup
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            visibility: screenshotMode ? 'hidden' : 'visible'
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.3, margin: '0 0 0 1em' }}>
            {item.id}
          </Typography>
          <FormControlLabel
            sx={{ marginRight: 0 }}
            control={<Checkbox color="secondary" checked={inlineFeatures} onChange={onChangeInlineFeatures} />}
            label="Inline features"
          />
        </FormGroup>
      </Box>
    </Box>
  )
}

export default ItemStats
