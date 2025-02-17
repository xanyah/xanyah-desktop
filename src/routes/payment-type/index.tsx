import { useCallback, useEffect, useMemo, useRef } from 'react'
import { usePaymentType, useCurrentStore } from '../../hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPaymentType, updatePaymentType } from '../../api'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentTypeSchema, paymentTypeSchemaType } from './config'
import { Controller, useForm } from 'react-hook-form'
import { FormContainer, FormSection, InputText } from '@/components'
import { useBreadCrumbContext } from '@/contexts/breadcrumb'
import toast from 'react-hot-toast'

const PaymentType = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toastId = useRef<string>(null)
  const store = useCurrentStore()
  const { id } = useParams()
  const { data: paymentTypeData } = usePaymentType(id)
  const { handleSubmit, control, reset } = useForm<paymentTypeSchemaType>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: {},
  })
  const pageTitle = useMemo(
    () => paymentTypeData?.data ? paymentTypeData?.data.name : t('paymentType.newPageTitle'),
    [t, paymentTypeData],
  )
  useBreadCrumbContext([
    { label: t('paymentTypes.pageTitle'), url: '/payment-types' },
    { label: pageTitle },
  ])

  const { mutate: createApiPaymentType } = useMutation({
    mutationFn: (newData: paymentTypeSchemaType) =>
      createPaymentType({ ...newData, storeId: store?.id }),
    onSuccess: (data) => {
      queryClient.setQueryData(['paymentTypes', { id }], data)
      navigate(`/payment-types/${data.data.id}/edit`)
      toast.success(t('global.saved'), { id: toastId?.current || undefined })
    }, onMutate: () => {
      toastId.current = toast.loading(t('global.loading'))
    },
    onError: () => {
      toast.error(t('global.savingError'), { id: toastId?.current || undefined })
    },
  })

  const { mutate: updateApiPaymentType } = useMutation({
    mutationFn: (newData: paymentTypeSchemaType) => updatePaymentType(id, newData),
    onSuccess: (data) => {
      queryClient.setQueryData(['paymentTypes', { id }], data)
      toast.success(t('global.saved'), { id: toastId?.current || undefined })
    }, onMutate: () => {
      toastId.current = toast.loading(t('global.loading'))
    },
    onError: () => {
      toast.error(t('global.savingError'), { id: toastId?.current || undefined })
    },
  })

  const onSubmit = useCallback((data: paymentTypeSchemaType) => {
    if (id) {
      return updateApiPaymentType(data)
    }
    return createApiPaymentType(data)
  }, [id, updateApiPaymentType, createApiPaymentType])

  useEffect(() => {
    if (paymentTypeData?.data) {
      reset(paymentTypeData?.data)
    }
  }, [paymentTypeData, reset])

  return (
    <FormContainer
      title={pageTitle}
      subtitle={t('paymentType.pageSubtitle')}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormSection
        title={t('paymentType.generalInformations')}
      >
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputText
              error={error?.message}
              onChange={onChange}
              value={value}
              placeholder={t('paymentType.namePlaceholder')}
              type="text"
              label={t('paymentType.nameLabel')}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputText
              error={error?.message}
              onChange={onChange}
              value={value}
              placeholder={t('paymentType.descriptionPlaceholder')}
              type="text"
              label={t('paymentType.descriptionLabel')}
            />
          )}
        />
      </FormSection>
    </FormContainer>
  )
}

export default PaymentType
