import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { ItemSearchRequest } from '@dmtool/application'
import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { authAtom } from 'infrastructure/dataAccess/atoms'
import { ComparisonOption, ItemCategory, ItemRarity, PriceUnit, Source, Visibility, WeaponProperty } from '@dmtool/domain'
import { AutoCompleteItem } from 'components/Autocomplete/AutocompleteItem'
import _, { capitalize } from 'lodash'

type SearchFilters = Omit<ItemSearchRequest, 'order' | 'orderBy'>

interface TableFiltersProps {
  onSearch: (filters: SearchFilters) => void
  filters: ItemSearchRequest
  setFilters: React.Dispatch<React.SetStateAction<ItemSearchRequest>>
  loading: boolean
}

const ItemTableFilters: React.FC<TableFiltersProps> = ({ onSearch, filters, setFilters, loading }) => {
  const [rarityFilter, setRarityFilter] = useState<ItemSearchRequest['rarity']>(filters.rarity || [])
  const [visibilityFilter, setVisibilityFilter] = useState<ItemSearchRequest['visibility']>(filters.visibility || [])
  const [categoryFilter, setCategoryFilter] = useState<ItemSearchRequest['category']>(filters.category || [])
  const [propertyFilter, setPropertyFilter] = useState<ItemSearchRequest['property']>(filters.property || [])
  const [sourceFilter, setSourceFilter] = useState<ItemSearchRequest['source']>(filters.source)
  const [searchFilter, setSearchFilter] = useState(filters.search)
  const [priceComparison, setPriceComparison] = useState<string>(filters.priceComparison || 'exactly')
  const [priceQuantity, setPriceQuantity] = useState(filters.priceQuantity ? String(filters.priceQuantity) : '')
  const [priceUnit, setPriceUnit] = useState(filters.priceUnit ? String(filters.priceUnit) : 'gp')
  const [weightComparison, setWeightComparison] = useState<string>(filters.weightComparison || 'exactly')
  const [weightFilter, setWeightFilter] = useState(filters.weight != null ? String(filters.weight) : '')
  const [onlyMyItems, setOnlyMyItems] = useState(filters.onlyMyItems != null ? filters.onlyMyItems : false)
  const [requiresAttunementFilter, setRequiresAttunementFilter] = useState<boolean | null>(
    typeof filters.requiresAttunement === 'undefined' ? null : filters.requiresAttunement
  )
  const [hasImageFilter, setHasImageFilter] = useState<boolean | null>(typeof filters.hasImage === 'undefined' ? null : filters.hasImage)
  const [authState] = useAtom(authAtom)

  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('md'))

  const onEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13) {
      internalOnSearch()
    }
  }

  const onClearPrice = () => {
    setPriceQuantity('')
  }

  const onClearWeight = () => {
    setWeightFilter('')
  }

  const onClearSearch = () => {
    setSearchFilter('')
  }

  const onToggleOnlyMyItems = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFilters((_itemTableFilters) => {
      return {
        ..._itemTableFilters,
        onlyMyItems: checked
      }
    })
  }

  const onSelectRequiresAttunementFilter = (value: boolean | null) => () => {
    setRequiresAttunementFilter(value)
  }

  const onSelectHasImageFilter = (value: boolean | null) => () => {
    setHasImageFilter(value)
  }

  useEffect(() => {
    if (filters.onlyMyItems !== onlyMyItems) {
      setOnlyMyItems(filters.onlyMyItems || false)
    }
  }, [filters.onlyMyItems])

  const internalOnSearch = () => {
    const searchFilters: SearchFilters = {
      search: searchFilter,
      visibility: visibilityFilter,
      rarity: rarityFilter,
      category: categoryFilter,
      property: propertyFilter,
      source: sourceFilter,
      priceComparison: priceComparison as `${ComparisonOption}`,
      priceQuantity: priceQuantity ?? undefined,
      priceUnit: priceUnit,
      weightComparison: weightComparison as `${ComparisonOption}`,
      weight: weightFilter ?? undefined,
      requiresAttunement: requiresAttunementFilter,
      hasImage: hasImageFilter
    }
    onSearch(searchFilters)
  }

  const filterItemMinWidth = '14em'

  return (
    <Paper
      sx={{
        width: '100%',
        background: (theme) => theme.palette.primary.main,
        margin: '1em 0 2em 0',
        padding: '1em',
        borderRadius: '0.6em',
        zIndex: '100',
        boxSizing: 'border-box',
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '1em'
      }}
    >
      <Typography variant="h5">Filters</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row',
          flexWrap: 'wrap',
          alignItems: isSmall ? 'flex-start' : 'flex-end',
          '& > *': {
            flex: isSmall ? '1 1 100%' : '0 1 32%',
            minWidth: filterItemMinWidth,
            width: isSmall ? '100%' : 'auto'
          },
          gap: '1em'
        }}
      >
        <Autocomplete
          multiple
          clearOnBlur
          disableCloseOnSelect
          disabled={loading}
          size="small"
          id="rarity-filter"
          options={Object.values(ItemRarity).map((rarity) => rarity.toString().toLowerCase())}
          getOptionLabel={(option) => option.replaceAll('_', ' ')}
          onChange={(_, newFilters) => {
            setRarityFilter(newFilters as ItemSearchRequest['rarity'])
          }}
          value={rarityFilter}
          PaperComponent={AutoCompleteItem}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Rarity"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
          )}
        />
        <Autocomplete
          multiple
          clearOnBlur
          disableCloseOnSelect
          disabled={loading}
          size="small"
          id="source-filter"
          options={_.without(Object.values(Source), Source.MyItem).map((source) => source.toString())}
          getOptionLabel={(option) => option.replaceAll('_', ' ')}
          onChange={(_, newFilters) => setSourceFilter(newFilters as ItemSearchRequest['source'])}
          value={sourceFilter}
          PaperComponent={AutoCompleteItem}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Source"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
          )}
        />
        <Autocomplete
          multiple
          clearOnBlur
          disableCloseOnSelect
          disabled={loading}
          size="small"
          id="category-filter"
          options={Object.values(ItemCategory).map((category) => category.toString())}
          getOptionLabel={(option) => option.replaceAll('-', ' ')}
          onChange={(_, newFilters) => setCategoryFilter(newFilters as ItemSearchRequest['category'])}
          value={categoryFilter}
          PaperComponent={AutoCompleteItem}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Categories"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
          )}
        />
        <Autocomplete
          multiple
          clearOnBlur
          disableCloseOnSelect
          disabled={loading}
          size="small"
          id="property-filter"
          options={Object.values(WeaponProperty).map((property) => property.toString())}
          getOptionLabel={(option) => option.replaceAll('-', ' ')}
          onChange={(_, newFilters) => setPropertyFilter(newFilters as ItemSearchRequest['property'])}
          value={propertyFilter}
          PaperComponent={AutoCompleteItem}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Properties"
              size="small"
              InputLabelProps={{
                shrink: true
              }}
            />
          )}
        />

        <Box sx={{ width: 'auto' }}>
          <FormLabel sx={{ fontSize: '1em', display: 'block', margin: '0 0 -6px 0' }}>Price</FormLabel>
          <Box sx={{ display: 'flex', gap: '0.5em', alignItems: 'end' }}>
            <div>
              <Select
                size="small"
                disabled={loading}
                value={priceComparison}
                onChange={(event) => setPriceComparison(event.target.value)}
                sx={{ width: '6em' }}
              >
                {Object.values(ComparisonOption).map((comparisonOption) => {
                  return (
                    <MenuItem key={comparisonOption} value={comparisonOption}>
                      {capitalize(comparisonOption)}
                    </MenuItem>
                  )
                })}
              </Select>
            </div>
            <TextField
              id={'price-filter'}
              value={priceQuantity}
              label={'amount'}
              type="number"
              size="small"
              disabled={loading}
              onChange={(event) => setPriceQuantity(event.target.value)}
              onKeyDown={onEnter}
              variant="outlined"
              onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                event.target.select()
              }}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={onClearPrice} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: '5em', flex: '1 1 auto' }}
            />

            <FormControl sx={{ flex: '1 1 16em' }}>
              <InputLabel>unit</InputLabel>
              <Select
                size="small"
                label="unit"
                value={priceUnit}
                onChange={(event) => setPriceUnit(event.target.value)}
                sx={{ '&& .MuiSelect-select': { textTransform: 'lowercase' } }}
                disabled={loading}
              >
                {Object.values(PriceUnit).map((priceUnit) => {
                  return (
                    <MenuItem key={priceUnit} value={priceUnit} sx={{ textTransform: 'lowercase' }}>
                      {priceUnit}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box>
          <FormLabel sx={{ fontSize: '1em', display: 'block', margin: '0 0 -6px 0' }}>Weight</FormLabel>
          <Box sx={{ display: 'flex', gap: '0.5em', alignItems: 'end' }}>
            <div>
              <Select
                size="small"
                value={weightComparison}
                onChange={(event) => setWeightComparison(event.target.value)}
                sx={{ width: '6em' }}
                disabled={loading}
              >
                {Object.values(ComparisonOption).map((comparisonOption) => {
                  return (
                    <MenuItem key={comparisonOption} value={comparisonOption}>
                      {capitalize(comparisonOption)}
                    </MenuItem>
                  )
                })}
              </Select>
            </div>
            <TextField
              id={'weight-filter'}
              value={weightFilter}
              label={'amount'}
              type="number"
              size="small"
              disabled={loading}
              onChange={(event) => setWeightFilter(event.target.value)}
              onKeyDown={onEnter}
              variant="outlined"
              onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
                event.target.select()
              }}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                endAdornment: (
                  <>
                    <InputAdornment position="end">
                      <IconButton onClick={onClearWeight} edge="end">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                    <InputAdornment position="end">lb.</InputAdornment>
                  </>
                )
              }}
              sx={{ width: '10em' }}
            />
          </Box>
        </Box>
        <Box>
          <FormLabel sx={{ fontSize: '1em' }}>Requires Attunement</FormLabel>
          <Box sx={{ display: 'flex', gap: '0.5em' }}>
            <ButtonGroup
              disabled={loading}
              variant="contained"
              sx={{ border: `1px solid ${theme.palette.grey[400]}`, '& > button': { fontWeight: '500' } }}
              disableElevation={true}
            >
              <Button onClick={onSelectRequiresAttunementFilter(null)} color={requiresAttunementFilter === null ? 'secondary' : 'primary'}>
                Any
              </Button>
              <Button onClick={onSelectRequiresAttunementFilter(true)} color={requiresAttunementFilter === true ? 'secondary' : 'primary'}>
                Include
              </Button>
              <Button
                onClick={onSelectRequiresAttunementFilter(false)}
                color={requiresAttunementFilter === false ? 'secondary' : 'primary'}
              >
                Exclude
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        <Box>
          <FormLabel sx={{ fontSize: '1em' }}>Has Image</FormLabel>
          <Box sx={{ display: 'flex', gap: '0.5em' }}>
            <ButtonGroup
              variant="contained"
              disabled={loading}
              sx={{ border: `1px solid ${theme.palette.grey[400]}`, '& > button': { fontWeight: '500' } }}
              disableElevation={true}
            >
              <Button onClick={onSelectHasImageFilter(null)} color={hasImageFilter === null ? 'secondary' : 'primary'}>
                Any
              </Button>
              <Button onClick={onSelectHasImageFilter(true)} color={hasImageFilter === true ? 'secondary' : 'primary'}>
                Include
              </Button>
              <Button onClick={onSelectHasImageFilter(false)} color={hasImageFilter === false ? 'secondary' : 'primary'}>
                Exclude
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        <Tooltip title="Searches from item name, short description and main description" placement="top-end" disableInteractive>
          <TextField
            id={'search-filter'}
            value={searchFilter}
            label={'Word Search'}
            disabled={loading}
            size="small"
            onChange={(event) => setSearchFilter(event.target.value)}
            onKeyDown={onEnter}
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={onClearSearch} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: 'max-content', margin: '1em 0 0 0' }}
          />
        </Tooltip>
        {authState.loggedIn && (
          <Autocomplete
            multiple
            clearOnBlur
            disableCloseOnSelect
            disabled={loading}
            size="small"
            id="visibility-filter"
            options={Object.values(Visibility).map((visibility) => visibility.toString().toLowerCase())}
            getOptionLabel={(option) => option.replaceAll('_', ' ')}
            onChange={(_, newFilters) => setVisibilityFilter(newFilters as ItemSearchRequest['visibility'])}
            value={visibilityFilter}
            PaperComponent={AutoCompleteItem}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Visibility"
                size="small"
                InputLabelProps={{
                  shrink: true
                }}
              />
            )}
            sx={{ margin: '1em 0 0 0' }}
          />
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          '& > *': {
            flex: '1 1 100%'
          },
          gap: '1em'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&&': { flex: '1 1 100%' } }}>
          {authState.loggedIn ? (
            <FormGroup sx={{ alignItems: 'flex-start' }}>
              <FormControlLabel
                sx={{ marginRight: 0, whiteSpace: 'nowrap' }}
                control={<Checkbox disabled={loading} color="secondary" checked={onlyMyItems} onChange={onToggleOnlyMyItems} />}
                label="Show only my items"
              />
            </FormGroup>
          ) : (
            <div />
          )}
          <LoadingButton loading={loading} variant="contained" color="secondary" endIcon={<SearchIcon />} onClick={internalOnSearch}>
            Search
          </LoadingButton>
        </Box>
      </Box>
    </Paper>
  )
}

export default ItemTableFilters
