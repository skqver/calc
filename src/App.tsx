import { useState, useMemo } from 'react';

interface CategoryResult {
  name: string;
  devices: number;
  accessories: number;
  percentage: number;
}

function App() {
  const [categories, setCategories] = useState<{ name: string; devices: string; accessories: string }[]>([
    { name: 'Смартфоны', devices: '', accessories: '' },
    { name: 'Ноутбуки', devices: '', accessories: '' },
    { name: 'Планшеты', devices: '', accessories: '' },
  ]);

  const [targetPercent, setTargetPercent] = useState<string>('80');

  const results = useMemo<CategoryResult[]>(() => {
    return categories.map((cat) => {
      const devices = parseInt(cat.devices) || 0;
      const accessories = parseInt(cat.accessories) || 0;
      const percentage = devices > 0 ? Math.round((accessories / devices) * 100) : 0;
      return { name: cat.name, devices, accessories, percentage };
    });
  }, [categories]);

  const totals = useMemo(() => {
    const totalDevices = results.reduce((sum, r) => sum + r.devices, 0);
    const totalAccessories = results.reduce((sum, r) => sum + r.accessories, 0);
    const totalPercentage = totalDevices > 0 ? Math.round((totalAccessories / totalDevices) * 100) : 0;
    return { totalDevices, totalAccessories, totalPercentage };
  }, [results]);

  const target = parseInt(targetPercent) || 80;

  const updateCategory = (index: number, field: 'name' | 'devices' | 'accessories', value: string) => {
    setCategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addCategory = () => {
    setCategories((prev) => [...prev, { name: '', devices: '', accessories: '' }]);
  };

  const removeCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= target) return 'text-green-600';
    if (percentage >= target * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= target) return 'bg-green-500';
    if (percentage >= target * 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusLabel = (percentage: number) => {
    if (percentage >= target) return '✓ Норма';
    if (percentage >= target * 0.7) return '⚠ Ниже нормы';
    return '✗ Критично';
  };

  const getBarWidth = (percentage: number) => {
    return Math.min(percentage, 150) / 1.5;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            📊 Калькулятор сопутствующего товара
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Расчёт процента прикрепления аксессуаров к основным устройствам
          </p>
        </div>

        {/* Target Setting */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 mb-6 border border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="text-sm font-medium text-slate-300 whitespace-nowrap">
              🎯 Целевой процент прикрепления:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={targetPercent}
                onChange={(e) => setTargetPercent(e.target.value)}
                min="1"
                max="200"
                className="w-20 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-slate-400">%</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4 mb-6">
          {categories.map((cat, index) => {
            const result = results[index];
            return (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Category Name */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => updateCategory(index, 'name', e.target.value)}
                      placeholder="Название категории"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Devices Input */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <label className="text-xs text-slate-400 block">Устройства</label>
                      <input
                        type="number"
                        value={cat.devices}
                        onChange={(e) => updateCategory(index, 'devices', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Accessories Input */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <label className="text-xs text-slate-400 block">Аксессуары</label>
                      <input
                        type="number"
                        value={cat.accessories}
                        onChange={(e) => updateCategory(index, 'accessories', e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Result */}
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getStatusColor(result.percentage)}`}>
                        {result.percentage}%
                      </div>
                      <div className={`text-xs ${getStatusColor(result.percentage)}`}>
                        {getStatusLabel(result.percentage)}
                      </div>
                    </div>
                    {categories.length > 1 && (
                      <button
                        onClick={() => removeCategory(index)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Удалить категорию"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>0%</span>
                    <span className="text-blue-400">Цель: {target}%</span>
                    <span>150%</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden relative">
                    {/* Target marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-blue-400/60 z-10"
                      style={{ left: `${Math.min(target, 150) / 1.5}%` }}
                    />
                    {/* Progress bar */}
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor(result.percentage)}`}
                      style={{ width: `${getBarWidth(result.percentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Category Button */}
        <button
          onClick={addCategory}
          className="w-full bg-slate-800/50 border border-dashed border-slate-600 rounded-xl p-4 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Добавить категорию
        </button>

        {/* Total Summary */}
        <div className="mt-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-blue-800/30">
          <h2 className="text-lg font-semibold mb-4 text-blue-300">📈 Итоговая статистика</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{totals.totalDevices}</div>
              <div className="text-sm text-slate-400">Всего устройств</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{totals.totalAccessories}</div>
              <div className="text-sm text-slate-400">Всего аксессуаров</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className={`text-3xl font-bold ${getStatusColor(totals.totalPercentage)}`}>
                {totals.totalPercentage}%
              </div>
              <div className="text-sm text-slate-400">Общий процент</div>
            </div>
          </div>

          {/* Total Progress Bar */}
          <div className="mt-4">
            <div className="h-4 bg-slate-700 rounded-full overflow-hidden relative">
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-blue-400/60 z-10"
                style={{ left: `${Math.min(target, 150) / 1.5}%` }}
              />
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor(totals.totalPercentage)}`}
                style={{ width: `${getBarWidth(totals.totalPercentage)}%` }}
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
            {totals.totalPercentage >= target ? (
              <p className="text-green-400 text-sm">
                ✅ <strong>Отличный результат!</strong> Процент прикрепления {totals.totalPercentage}% превышает целевой показатель {target}%.
              </p>
            ) : totals.totalPercentage >= target * 0.7 ? (
              <p className="text-yellow-400 text-sm">
                ⚠️ <strong>Почти норма.</strong> Не хватает {target - totals.totalPercentage}% до целевого показателя. Уделите внимание допродажам аксессуаров.
              </p>
            ) : (
              <p className="text-red-400 text-sm">
                ❌ <strong>Низкий показатель!</strong> Процент прикрепления значительно ниже нормы. Необходимо усилить работу по продаже сопутствующих товаров.
              </p>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <h3 className="text-sm font-medium text-slate-400 mb-2">💡 Как пользоваться:</h3>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>• <strong>Устройства</strong> — количество проданных основных товаров (телефоны, ноутбуки и т.д.)</li>
            <li>• <strong>Аксессуары</strong> — количество проданных сопутствующих товаров (чехлы, зарядки, наушники и т.д.)</li>
            <li>• <strong>Процент прикрепления</strong> = (Аксессуары ÷ Устройства) × 100%</li>
            <li>• Установите целевой процент и отслеживайте выполнение по категориям</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-600">
          Калькулятор сопутствующего товара • {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

export default App;
