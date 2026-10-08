import { useState } from 'react';
import { Calculator as CalcIcon, Sparkles, Scale, CheckCircle2 } from 'lucide-react';

export default function Calculator() {
  const [formData, setFormData] = useState({
    category: 'Men',
    brandTier: 'Mid-Range',
    condition: 'Gently Used',
    originalPrice: '',
  });

  const [result, setResult] = useState(null);

  const calculateValue = (e) => {
    e.preventDefault();
    const original = parseFloat(formData.originalPrice) || 0;

    let conditionMultiplier = 0.5;
    if (formData.condition === 'Brand New with Tags') conditionMultiplier = 0.75;
    else if (formData.condition === 'Like New') conditionMultiplier = 0.65;
    else if (formData.condition === 'Gently Used') conditionMultiplier = 0.5;
    else if (formData.condition === 'Well Worn') conditionMultiplier = 0.3;

    let brandBonus = 1.0;
    if (formData.brandTier === 'Luxury / High-End') brandBonus = 1.25;
    else if (formData.brandTier === 'Premium / Streetwear') brandBonus = 1.1;
    else if (formData.brandTier === 'Mid-Range') brandBonus = 1.0;
    else if (formData.brandTier === 'Fast Fashion') brandBonus = 0.85;

    const estimatedSwapValue = Math.round(original * conditionMultiplier * brandBonus);

    setResult({
      swapValue: estimatedSwapValue,
      fairTier:
        estimatedSwapValue > 2500
          ? 'Tier A (High Value Swap)'
          : estimatedSwapValue > 1000
          ? 'Tier B (Standard Swap)'
          : 'Tier C (Budget / Everyday Swap)',
      recommendation: `Recommended to swap with items in the ₹${Math.max(
        100,
        estimatedSwapValue - 300
      )} – ₹${estimatedSwapValue + 300} range for a fair barter exchange.`,
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <CalcIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Swap Value Calculator</h1>
            <p className="text-xs text-gray-500">
              Estimate fair barter value based on condition, brand tier, and category to ensure balanced swaps
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <form
            onSubmit={calculateValue}
            className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option>Men</option>
                <option>Women</option>
                <option>Kids</option>
                <option>Unisex</option>
                <option>Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Brand Tier</label>
              <select
                value={formData.brandTier}
                onChange={(e) => setFormData({ ...formData, brandTier: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option>Fast Fashion (Zara, H&M, etc.)</option>
                <option>Mid-Range (Levis, Nike, Adidas)</option>
                <option>Premium / Streetwear (Superdry, Tommy)</option>
                <option>Luxury / High-End</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Item Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option>Brand New with Tags</option>
                <option>Like New</option>
                <option>Gently Used</option>
                <option>Well Worn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Original Retail Price (₹)</label>
              <input
                type="number"
                required
                placeholder="e.g. 2499"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Calculate Swap Value
            </button>
          </form>

          {/* Results Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Valuation Complete
                </div>

                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase">Estimated Swap Value</span>
                  <div className="text-4xl font-black text-gray-900 mt-1">₹{result.swapValue}</div>
                  <span className="inline-block mt-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                    {result.fairTier}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" /> Barter Exchange Guide
                  </p>
                  {result.recommendation}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <Scale className="w-12 h-12 stroke-[1.5] mb-2 text-gray-300" />
                <p className="text-sm font-semibold text-gray-600">Enter Details to Calculate</p>
                <p className="text-xs mt-1">Get an instant fair market exchange valuation for your clothing swap.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}