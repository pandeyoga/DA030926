/**
 * SettlementImportPanel — hasil baca laporan pencairan (Shopee/TikTok) yang MENGISI form,
 * bukan menyimpan. Kolom sumber tiap angka & kolom angka yang tidak terpetakan ditampilkan
 * supaya pemetaan tidak pernah "ditebak diam-diam" (aturan BD-2).
 */
import { FileSpreadsheet, X, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass';
import { Badge } from '@/components/ui/badge';
import { formatRupiah as rp } from '@/lib/format';

export const FIELD_LABELS = {
  gross_sales: 'Omzet bruto', refunds: 'Refund / retur', seller_discount: 'Diskon penjual',
  shipping_subsidy: 'Subsidi ongkir', platform_commission: 'Komisi platform',
  platform_service_fee: 'Fee layanan', affiliate_commission: 'Komisi afiliasi',
  ads_deduction: 'Potongan iklan', other_deductions: 'Potongan lain',
  adjustments: 'Penyesuaian', net_payout: 'Nominal dicairkan',
};

export function SettlementImportPanel({ result, onClose }) {
  if (!result) return null;
  const mapped = Object.entries(result.mapping || {});
  const unmapped = result.unmapped_numeric_columns || [];
  return (
    <GlassCard className="p-4 space-y-2" data-testid="fin-settlement-import-panel">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" /> Hasil baca “{result.filename}”
          <span className="text-xs text-foreground/50">
            {result.row_count} baris · {result.platform_guess || 'platform tidak terdeteksi'}
          </span>
        </h3>
        <button data-testid="fin-settlement-import-close" onClick={onClose}
          className="p-1 rounded hover:bg-foreground/10"><X className="w-4 h-4" /></button>
      </div>
      <p className="text-xs text-foreground/60">
        Angka di bawah sudah dimasukkan ke form — <b>periksa dulu</b>, lalu isi nominal menurut
        mutasi bank bila kolomnya tidak ada di laporan. Tidak ada yang tersimpan sebelum Anda menekan Simpan.
      </p>
      <div className="grid md:grid-cols-2 gap-2 text-xs" data-testid="fin-settlement-import-mapping">
        {mapped.map(([field, cols]) => (
          <div key={field} className="rounded-lg bg-foreground/5 px-3 py-2 flex items-start justify-between gap-2">
            <div>
              <div className="font-medium">{FIELD_LABELS[field] || field}</div>
              <div className="text-foreground/50">← {cols.join(' + ')}</div>
            </div>
            <b className="tabular-nums whitespace-nowrap">{rp(result.values?.[field] || 0)}</b>
          </div>
        ))}
      </div>
      {unmapped.length > 0 ? (
        <div className="text-xs rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-200 px-3 py-2"
          data-testid="fin-settlement-import-unmapped">
          <div className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" /> {unmapped.length} kolom angka tidak dikenali — pastikan tidak ada potongan yang terlewat:
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {unmapped.map((c) => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
          </div>
        </div>
      ) : null}
    </GlassCard>
  );
}
