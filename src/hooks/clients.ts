import { useQuery } from '@tanstack/react-query'
import { getClient, getClients, searchClient } from '../api'
import { ObjectValidator } from '../utils'

export const useClients = (params) => useQuery({
  queryFn: () => getClients(params),
  queryKey: ['clients', params],
})

export const useSearchedClients = (searchQuery) => useQuery({
  enabled: !!ObjectValidator(searchQuery),
  queryFn: () => searchClient(searchQuery),
  queryKey: ['clients', searchQuery],
})


export const useClient = (id?: Client['id']) => useQuery({
  queryFn: () => getClient(id),
  queryKey: ['clients', { id }],
  enabled: !!id
})
