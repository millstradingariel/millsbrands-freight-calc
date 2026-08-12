'use client';

import React, { useState } from 'react';

export default function NewSkuPage() {
    const [weight, setWeight] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    const [freightCarrier, setFreightCarrier] = useState('');
    const [shippingMethod, setShippingMethod] = useState('');
    const [partsShipping, setPartsShipping] = useState('');
    const [chargeableWeight, setChargeableWeight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/new`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `[{"weight":${weight},"length":${length},"width":${width},"height":${height}}]`,
                }),
            });

            const data = await res.json();

            if (res.status === 500) {
                setErrorMessage('Oops... something went wrong. Please contact ESS Team or send an email to mills.ecommsupport@millsbrands.com.au.');
                return;
            }

            if (!res.ok) {
                setErrorMessage(data.message || 'Failed to calculate freight.');
                return;
            }

            const result = data;

            if (!result) {
                setErrorMessage('No shipping options returned.');
                return;
            }

            setFreightCarrier(result.CourierName ?? '');
            setShippingMethod(result.ShippingMethodName ?? '');
            setPartsShipping(result.Cost ?? '');
            setChargeableWeight(result.ChargeableWeight ?? '');
        } catch (err) {
            setErrorMessage('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setWeight('');
        setLength('');
        setWidth('');
        setHeight('');
        setFreightCarrier('');
        setShippingMethod('');
        setPartsShipping('');
        setChargeableWeight('');
        setErrorMessage('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100 mb-1 uppercase">New SKU</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    This option is for freight items with one carton.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                    Enter the Dimensions then press Calculate. Results will be displayed on the right pane.
                </p>
            </div>

            <hr className="border-zinc-700/60" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Form Panel */}
                <form onSubmit={handleCalculate} className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Dimensions</h3>

                    <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Weight (g)</label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                        />
                    </div>

                    <div>
                        <div className="grid grid-cols-3 gap-2">
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Length (mm)</label>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Width (mm)</label>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Height (mm)</label>
                        </div>
                        <div className="grid grid-cols-3 gap-2">

                            <input
                                type="number"
                                value={length}
                                onChange={(e) => setLength(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                            />
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                            />
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition-all"
                            />
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

                {/* Right Results Panel */}
                <div className="bg-zinc-900 border border-zinc-700 shadow-xl shadow-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-4">Shipping Method Name</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-zinc-800/80">
                                <span className="text-zinc-400">Freight Carrier:</span>
                                <span className="font-medium text-sky-500">{freightCarrier || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-zinc-400">Chargeable Weight:</span>
                                <span className="font-medium text-sky-500">{chargeableWeight || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-zinc-400">Shipping Category:</span>
                                <span className="font-medium text-sky-500">{shippingMethod || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-zinc-400">Parts Shipping:</span>
                                <span className="font-medium text-sky-500">
                                    {partsShipping === ''
                                        ? '—'
                                        : Number(partsShipping) === 0
                                            ? 'FREE'
                                            : `$${partsShipping}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}