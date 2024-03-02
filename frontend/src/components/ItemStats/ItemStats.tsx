import React, { useState } from 'react'
import _ from 'lodash'

import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'
import { ImageDTO, ItemDTO } from '@dmtool/application'
import ItemCard from 'components/ItemCard'
import { dateStringFromUnixTime } from '@dmtool/common'

interface ItemStatsProps {
  item: ItemDTO | null
  image?: ImageDTO | null
  loadingItem: boolean
  loadingImage: boolean
  screenshotMode?: boolean
}

export const ItemStats: React.FC<ItemStatsProps> = ({ item, loadingItem, image, loadingImage, screenshotMode }) => {
  const [inlineFeatures, setInlineFeatures] = useState(false)

  const onChangeInlineFeatures = () => {
    setInlineFeatures((_inlineFeatures) => !_inlineFeatures)
  }

  if (!item) {
    return null
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: '1em', width: 'fit-content', margin: '0 auto' }}>
      <ItemCard item={item} loadingItem={loadingItem} image={image} loadingImage={loadingImage} inlineFeatures={inlineFeatures} />
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
                Created by: <span style={{ fontWeight: '600' }}>{item.createdByUserName}</span>
              </Typography>
            )}
            {item.updatedAt && (
              <Typography variant="body2">
                Last updated: <span>{dateStringFromUnixTime(item.updatedAt)}</span>
              </Typography>
            )}
          </div>
        )}
        <FormGroup sx={{ alignItems: 'flex-end', visibility: screenshotMode ? 'hidden' : 'visible' }}>
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
