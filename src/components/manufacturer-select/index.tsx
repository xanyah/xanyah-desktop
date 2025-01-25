import { useCurrentStore, useManufacturer } from "@/hooks"
import { useCallback } from 'react';
import { getManufacturers } from '@/api';
import ApiDataSelect from '../api-data-select';

type ManufacturerSelectProps = {
  onChange: (newValue?: Manufacturer['id']) => void
  value: Manufacturer['id']
}

const ManufacturerSelect = ({onChange, value}: ManufacturerSelectProps) => {
  const store = useCurrentStore()

  const getFilteredRecords = useCallback((searchQuery) => {
    return getManufacturers({
      'q[storeIdEq]': store?.id,
      'q[nameOrNoteCont]': searchQuery
    })
  }, [store])

  return <ApiDataSelect
  onChange={onChange}
  value={value}
  useRecordHook={useManufacturer}
  getRecordValue={(record: Manufacturer) => record.id}
  getRecordLabel={(record: Manufacturer) => record.name}
  getFilteredRecords={getFilteredRecords}
  />
}

export default ManufacturerSelect
