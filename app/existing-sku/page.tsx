'use client';

import React, { useState } from 'react';

export default function ExistingSkuPage() {
    const [sku, setSku] = useState('');
    const [postcode, setPostcode] = useState('');
    const [quantity, setQuantity] = useState('1');

    const [freightCarrier, setFreightCarrier] = useState('');
    const [shippingMethod, setShippingMethod] = useState('');
    const [customerFreight, setCustomerFreight] = useState('');
    const [courierFreightCost, setCourierFreightCost] = useState('');
    const [chargeableWeight, setChargeableWeight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/existing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `[{"postcode":"${postcode}","products":[{"sku":"${sku}","quantity":${quantity}}]}]`,
                }),
            });

            if (res.status === 500) {
                setErrorMessage('Something went wrong. Please contact ESS Team or send an email to: mills.ecommsupport@millsbrands.com.au');
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                setErrorMessage(data.message || 'Failed to calculate freight.');
                return;
            }

            const result = data[0];

            if (!result) {
                setErrorMessage('No shipping options returned.');
                return;
            }

            const product = result.products?.[0];

            if (!product) {
                setErrorMessage('No shipping options returned.');
                return;
            }

            if (product.success === false || product.error) {
                setErrorMessage('SKU not found');
                return;
            }

            setFreightCarrier(product.CourierName ?? '');
            setShippingMethod(product.shippingmethod ?? '');
            setCustomerFreight(product.cost ?? '');
            setCourierFreightCost(product.CourierCost ?? '');
            setChargeableWeight(product.ChargeableWeight ?? '');
        } catch (err) {
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setSku('');
        setPostcode('');
        setQuantity('1');
        setFreightCarrier('');
        setShippingMethod('');
        setCustomerFreight('');
        setCourierFreightCost('');
        setChargeableWeight('');
        setErrorMessage('');
    };

    function formatFreight(value: string | number): string {
        if (value === '' || value === null || value === undefined) return '—';
        const num = Number(value);
        if (isNaN(num)) return '—';
        if (num === 0) return 'FREE';
        return num.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold tracking-wider text-zinc-100 mb-1 uppercase">Existing SKU</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    This option is for SKUs that are already existing in the database. You'll only need to enter the SKU Code and the Postcode to solve this.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                    Enter the SKU code and postcode to look up freight metrics. Results will appear on the right panel.
                </p>
                <div className="mt-2 p-3 rounded-lg bg-sky-700/10 border border-sky-600/20 text-sky-500 text-xs font-semibold">
                    <strong className="text-sm">NOTE:</strong> For eBay purchases, Customer Freight Costs may vary in actual as Postage cost is adjusted when SKU is on sale.
                    <br /><span className="sm:flex sm:ml-14">Please refer to eBay listing postage calculator for actual postage cost. Do not put any Kitted SKUs.</span>
                </div>
            </div>

            <hr className="border-zinc-600/60" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={handleCalculate} className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">SKU and POSTCODE</h3>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">SKU Code</label>
                        <input
                            type="text"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            placeholder="e.g., SKU-12345"
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Postcode</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={postcode}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setPostcode(val);
                            }}
                            placeholder="e.g., 2000"
                            maxLength={4}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Quantity</label>
                        <div className="flex items-center bg-zinc-900/50 border border-zinc-700 rounded-lg overflow-hidden focus-within:border-sky-600 focus-within:ring-1 focus-within:ring-sky-600 transition-all">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, Number(quantity) - 1).toString())}
                                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-zinc-300 font-bold text-sm transition-colors border-r-sky-600 cursor-pointer"
                            >
                                -
                            </button>

                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full bg-transparent text-center py-2.5 text-sm text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />

                            <button
                                type="button"
                                onClick={() => setQuantity(((Number(quantity) || 0) + 1).toString())}
                                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-zinc-300 font-bold text-sm transition-colors border-l-sky-600 cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="text-rose-400 text-xs font-medium bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                            {errorMessage}
                        </p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-100 font-medium py-2.5 px-4 rounded-lg text-sm transition-all shadow-lg shadow-sky-600/20 cursor-pointer"
                        >
                            {isLoading ? 'Calculating…' : 'Calculate'}
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                            className="flex-1 bg-zinc-500 hover:bg-zinc-600 text-zinc-100 font-medium py-2.5 px-4 rounded-lg text-sm border border-zinc-600 transition-all cursor-pointer"
                        >
                            Clear
                        </button>
                    </div>
                </form>

                <div className="bg-zinc-900 border border-zinc-700 shadow-xl shadow-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Calculated Costs</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-zinc-800/80">
                                <span className="text-zinc-400">Freight Carrier:</span>
                                <span className="font-medium text-sky-500">{freightCarrier || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-zinc-800/80">
                                <span className="text-zinc-400">Shipping Method:</span>
                                <span className="font-medium text-sky-500">{shippingMethod || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-zinc-800/80">
                                <span className="text-zinc-400">Customer Freight:</span>
                                <span className="font-medium text-sky-500">{formatFreight(customerFreight)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-zinc-800/80">
                                <span className="text-zinc-400">Courier Freight:</span>
                                <span className="font-medium text-sky-500">{formatFreight(courierFreightCost)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-zinc-400">Chargeable Weight:</span>
                                <span className="font-medium text-sky-500">
                                    {chargeableWeight !== '' ? `${chargeableWeight} kg` : '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-zinc-500 pt-3 border-t border-zinc-800">
                        <p>Note: Add $70 for remote suburbs (Suburb1, Suburb2, Suburb3).</p>
                    </div>
                </div>
            </div>
        </div>
    );
}