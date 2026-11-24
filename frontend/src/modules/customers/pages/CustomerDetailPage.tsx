import { useEffect, useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { customerApi } from '@/api/customerApi'
import ErpSidebar from '@/components/layout/ErpSidebar'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { erpFooterNavItems, erpNavItems } from '@/constants/navigation'
import { useErp } from '@/context/ErpContext'
import type {
  CreateCustomerInput,
  CustomerType,
  ErpCustomer,
  UpdateCustomerInput,
} from '@/types/erp'
import type { PageProps } from '@/types'

interface CustomerFormValues {
  customer_type: CustomerType
  name: string
  company_name: string
  email: string
  phone: string
  alternate_phone: string
  billing_address: string
  shipping_address: string
  city: string
  state: string
  postal_code: string
  country: string
  tax_id: string
  gst_number: string
  notes: string
}

const emptyForm: CustomerFormValues = {
  customer_type: 'INDIVIDUAL',
  name: '',
  company_name: '',
  email: '',
  phone: '',
  alternate_phone: '',
  billing_address: '',
  shipping_address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  tax_id: '',
  gst_number: '',
  notes: '',
}

const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fieldClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

function toFormValues(customer: ErpCustomer): CustomerFormValues {
  return {
    customer_type: customer.customer_type,
    name: customer.name ?? '',
    company_name: customer.company_name ?? '',
    email: customer.email ?? '',
    phone: customer.phone ?? '',
    alternate_phone: customer.alternate_phone ?? '',
    billing_address: customer.billing_address ?? '',
    shipping_address: customer.shipping_address ?? '',
    city: customer.city ?? '',
    state: customer.state ?? '',
    postal_code: customer.postal_code ?? '',
    country: customer.country ?? '',
    tax_id: customer.tax_id ?? '',
    gst_number: customer.gst_number ?? '',
    notes: customer.notes ?? '',
  }
}

function buildCustomerPayload(values: CustomerFormValues): CreateCustomerInput {
  const optionalValue = (value: string) => value.trim() || undefined

  return {
    name: values.name.trim(),
    customer_type: values.customer_type,
    company_name: optionalValue(values.company_name),
    email: optionalValue(values.email),
    phone: optionalValue(values.phone),
    alternate_phone: optionalValue(values.alternate_phone),
    billing_address: optionalValue(values.billing_address),
    shipping_address: optionalValue(values.shipping_address),
    city: optionalValue(values.city),
    state: optionalValue(values.state),
    postal_code: optionalValue(values.postal_code),
    country: optionalValue(values.country),
    tax_id: optionalValue(values.tax_id),
    gst_number: optionalValue(values.gst_number)?.toUpperCase(),
    notes: optionalValue(values.notes),
  }
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  wide = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  wide?: boolean
}) {
  return (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      {wide && (label.includes('address') || label === 'Notes') ? (
        <textarea
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          rows={label === 'Notes' ? 4 : 2}
          className={fieldClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClass}
        />
      )}
    </label>
  )
}

export default function CustomerDetailPage({
  onNavigate,
}: PageProps) {
  const { activeOrderId, setActiveOrderId } = useErp()
  const isEditing = Boolean(activeOrderId)
  const [customer, setCustomer] = useState<ErpCustomer | null>(null)
  const [values, setValues] = useState<CustomerFormValues>(emptyForm)
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [statusSubmitting, setStatusSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!activeOrderId) {
      setCustomer(null)
      setValues(emptyForm)
      setLoading(false)
      setLoadError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setLoadError(null)

    customerApi
      .getCustomerById(activeOrderId)
      .then((result) => {
        if (!cancelled) {
          setCustomer(result)
          setValues(toFormValues(result))
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : 'Failed to load customer'
          setLoadError(message)
          toast.error(message)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeOrderId])

  const updateValue = <K extends keyof CustomerFormValues>(
    key: K,
    value: CustomerFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }))
    setFormError(null)
  }

  const validate = (payload: CreateCustomerInput): string | null => {
    if (!payload.name) return 'Customer name is required'
    if (
      payload.customer_type === 'BUSINESS' &&
      !payload.company_name
    ) {
      return 'Company name is required for Business customers'
    }
    if (payload.email && !emailPattern.test(payload.email)) {
      return 'Enter a valid email address'
    }
    if (payload.gst_number && !gstinPattern.test(payload.gst_number)) {
      return 'Enter a valid GSTIN'
    }
    return null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting || statusSubmitting) return

    const payload = buildCustomerPayload(values)
    const validationError = validate(payload)
    if (validationError) {
      setFormError(validationError)
      toast.error(validationError)
      return
    }

    setSubmitting(true)
    setFormError(null)
    try {
      if (activeOrderId) {
        const updatePayload: UpdateCustomerInput = payload
        await customerApi.updateCustomer(activeOrderId, updatePayload)
        toast.success('Customer updated successfully')
      } else {
        await customerApi.createCustomer(payload)
        toast.success('Customer created successfully')
      }
      onNavigate('customers')
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to save customer'
      setFormError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCustomerStatusChange = async () => {
    if (!customer || statusSubmitting || submitting) return

    const action = customer.is_active ? 'deactivate' : 'reactivate'
    const actionLabel = customer.is_active ? 'Deactivate' : 'Reactivate'
    if (
      !window.confirm(
        `${actionLabel} ${customer.name}? ${
          customer.is_active
            ? 'The customer can be reactivated later.'
            : 'The customer will become active again.'
        }`,
      )
    ) {
      return
    }

    setStatusSubmitting(true)
    try {
      if (customer.is_active) {
        await customerApi.deleteCustomer(customer._id)
      } else {
        await customerApi.updateCustomer(customer._id, { is_active: true })
      }

      toast.success(`Customer ${customer.name} ${action}d successfully`)
      try {
        const refreshedCustomer = await customerApi.getCustomerById(customer._id)
        setCustomer(refreshedCustomer)
      } catch {
        toast.error('Customer status was updated, but details could not be refreshed')
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : `Failed to ${action} customer`
      toast.error(message)
    } finally {
      setStatusSubmitting(false)
    }
  }

  const handleBack = () => onNavigate('customers')

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <ErpSidebar
        navItems={erpNavItems}
        footerItems={erpFooterNavItems}
        activePage="customers"
        onNavigate={onNavigate}
        onNewRecordClick={() => {
          setActiveOrderId(null)
          onNavigate('customer-detail')
        }}
      />
      <div className="ml-60 flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Back to customers"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {isEditing ? 'Edit Customer' : 'Create Customer'}
              </h1>
              {customer && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {customer.customer_code}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            form="customer-form"
            disabled={loading || submitting || statusSubmitting || Boolean(loadError)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {submitting ? 'Saving...' : 'Save Customer'}
          </button>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 space-y-5 p-4 sm:p-6">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <LoadingSpinner />
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-medium text-red-700">{loadError}</p>
              <button
                type="button"
                onClick={handleBack}
                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Back to Customers
              </button>
            </div>
          ) : (
            <form id="customer-form" onSubmit={handleSubmit} className="space-y-5">
              {customer && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Customer code
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                      {customer.customer_code}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      customer.is_active
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleCustomerStatusChange()}
                    disabled={statusSubmitting || submitting}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      customer.is_active
                        ? 'text-amber-700 hover:bg-amber-50'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {statusSubmitting
                      ? customer.is_active
                        ? 'Deactivating...'
                        : 'Reactivating...'
                      : customer.is_active
                        ? 'Deactivate'
                        : 'Reactivate'}
                  </button>
                </div>
              )}

              <Section title="Basic information">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Customer type <span className="text-red-600">*</span>
                  </span>
                  <select
                    value={values.customer_type}
                    onChange={(event) =>
                      updateValue(
                        'customer_type',
                        event.target.value as CustomerType,
                      )
                    }
                    className={fieldClass}
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="BUSINESS">Business</option>
                  </select>
                </label>
                <Field
                  label="Customer name"
                  value={values.name}
                  required
                  onChange={(value) => updateValue('name', value)}
                />
                {values.customer_type === 'BUSINESS' && (
                  <Field
                    label="Company name"
                    value={values.company_name}
                    required
                    onChange={(value) => updateValue('company_name', value)}
                  />
                )}
              </Section>

              <Section title="Contact information">
                <Field
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={(value) => updateValue('email', value)}
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={values.phone}
                  onChange={(value) => updateValue('phone', value)}
                />
                <Field
                  label="Alternate phone"
                  type="tel"
                  value={values.alternate_phone}
                  onChange={(value) => updateValue('alternate_phone', value)}
                />
              </Section>

              <Section title="Address information">
                <Field
                  label="Billing address"
                  value={values.billing_address}
                  wide
                  onChange={(value) => updateValue('billing_address', value)}
                />
                <Field
                  label="Shipping address"
                  value={values.shipping_address}
                  wide
                  onChange={(value) => updateValue('shipping_address', value)}
                />
                <Field
                  label="City"
                  value={values.city}
                  onChange={(value) => updateValue('city', value)}
                />
                <Field
                  label="State"
                  value={values.state}
                  onChange={(value) => updateValue('state', value)}
                />
                <Field
                  label="Postal code"
                  value={values.postal_code}
                  onChange={(value) => updateValue('postal_code', value)}
                />
                <Field
                  label="Country"
                  value={values.country}
                  onChange={(value) => updateValue('country', value)}
                />
              </Section>

              <Section title="Tax information">
                <Field
                  label="Tax ID"
                  value={values.tax_id}
                  onChange={(value) => updateValue('tax_id', value)}
                />
                <Field
                  label="GSTIN"
                  value={values.gst_number}
                  onChange={(value) => updateValue('gst_number', value)}
                />
              </Section>

              <Section title="Additional information">
                <Field
                  label="Notes"
                  value={values.notes}
                  wide
                  onChange={(value) => updateValue('notes', value)}
                />
              </Section>

              {formError && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pb-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={submitting || statusSubmitting}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {submitting ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  )
}
