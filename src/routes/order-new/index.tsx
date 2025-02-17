import { useCallback, useRef } from 'react'
import { useCurrentStore } from '../../hooks'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createOrder } from '../../api'
import { useTranslation } from 'react-i18next'
import { CheckoutProductCard, CustomerSelect, FormContainer, FormSection } from '@/components'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from '../../constants/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import ProductSelect from '@/components/product-select'
import { findIndex, map } from 'lodash'
import { useBreadCrumbContext } from '@/contexts/breadcrumb'
import toast from 'react-hot-toast'

const formSchema = z.object({
  customerId: z.string(),
  orderProductsAttributes: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      amountCents: z.number().optional(),
      amountCurrency: z.literal('EUR').optional(),
    }),
  ).min(1),
})

type FormType = z.infer<typeof formSchema>

const Order = () => {
  const navigate = useNavigate()
  const store = useCurrentStore()
  const { t } = useTranslation()
  const toastId = useRef<string>(null)
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  })
  useBreadCrumbContext([
    { label: t('orders.pageTitle'), url: '/orders' },
    { label: t('orderNew.pageTitle') },
  ])
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'orderProductsAttributes',
  })

  const { mutate: createApiOrder } = useMutation({
    mutationFn: (newData: any) =>
      createOrder({ ...newData, storeId: store?.id }),
    onSuccess: (data) => {
      navigate(`/orders/${data.data.id}`)
      toast.success(t('global.saved'), { id: toastId?.current || undefined })
    },
    onMutate: () => {
      toastId.current = toast.loading(t('global.loading'))
    },
    onError: () => {
      toast.error(t('global.savingError'), { id: toastId?.current || undefined })
    },
  })

  const onSubmit = useCallback((data: FormType) => {
    createApiOrder({ ...data, storeId: store?.id })
  }, [store, createApiOrder])

  const onProductSelect = useCallback((newProductId?: Product['id']) => {
    if (!newProductId) {
      return
    }

    const existingProductIndex = findIndex(fields, { productId: newProductId })

    if (existingProductIndex !== -1) {
      update(existingProductIndex, {
        ...fields[existingProductIndex],
        quantity: fields[existingProductIndex].quantity + 1,
      })
    }
    else {
      append({ productId: newProductId, quantity: 1 })
    }
  }, [fields, append, update])

  return (
    <FormContainer
      title={t('orderNew.pageTitle')}
      subtitle={t('orderNew.pageSubtitle')}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormSection title={t('orderNew.generalInformations')}>
        <Controller
          control={control}
          name="customerId"
          render={({ field: { onChange, value } }) => (
            <CustomerSelect
              onChange={onChange}
              value={value}
              label={t('orderNew.customerLabel')}
              placeholder={t('orderNew.customerPlaceholder')}
            />
          )}
        />
        <ProductSelect
          onChange={onProductSelect}
          label={t('orderNew.productLabel')}
          placeholder={t('orderNew.productPlaceholder')}
        />
        {map(fields, (field, index) => (
          <CheckoutProductCard
            productId={field.productId}
            quantity={field.quantity}
            key={field.productId}
            onRemove={() => remove(index)}
            onQuantityUpdate={newQuantity => update(index, { ...field, quantity: newQuantity })}
          />
        ))}
      </FormSection>
    </FormContainer>
  )
}

export default Order
