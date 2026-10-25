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
    if (percentage >= target * 0.7) return 'text-[#FC850D]';
    return 'text-red-500';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= target) return 'bg-green-500';
    if (percentage >= target * 0.7) return 'bg-[#FC850D]';
    return 'bg-red-400';
  };

  const getStatusLabel = (percentage: number) => {
    if (percentage >= target) return '✓ Норма';
    if (percentage >= target * 0.7) return '⚠ Ниже плана';
    return '✗ Критично';
  };

  const getBarWidth = (percentage: number) => {
    return Math.min(percentage, 150) / 1.5;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* DNS Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-[#FC850D] rounded-lg px-3 py-1.5">
              <span className="text-white font-black text-xl tracking-tight">DNS</span>
            </div>
            <span className="hidden sm:inline text-sm text-gray-500 border-l border-gray-200 pl-3">
              Калькулятор сопутствующего товара
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Расчёт процента сопутствующего товара
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Контроль прикрепления аксессуаров к основным устройствам по категориям
          </p>
        </div>

        {/* Target Setting Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FC850D]/10 rounded-lg flex items-center justify-center">
                <span className="text-[#FC850D] text-sm font-bold">%</span>
              </div>
              <label className="text-sm font-semibold text-gray-700">
                Целевой показатель прикрепления
              </label>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <input
                type="number"
                value={targetPercent}
                onChange={(e) => setTargetPercent(e.target.value)}
                min="1"
                max="200"
                className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#FC850D]/30 focus:border-[#FC850D] transition-all"
              />
              <span className="text-gray-400 font-medium">%</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3 mb-5">
          {categories.map((cat, index) => {
            const result = results[index];
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Category Name */}
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 font-medium mb-1 block">Категория</label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => updateCategory(index, 'name', e.target.value)}
                      placeholder="Название категории"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FC850D]/30 focus:border-[#FC850D] transition-all"
                    />
                  </div>

                  {/* Devices Input */}
                  <div>
                    <label className="text-xs text-gray-400 font-medium mb-1 block text-center">Устройства</label>
                    <input
                      type="number"
                      value={cat.devices}
                      onChange={(e) => updateCategory(index, 'devices', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-28 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-center text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FC850D]/30 focus:border-[#FC850D] transition-all"
                    />
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center pt-5">
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* Accessories Input */}
                  <div>
                    <label className="text-xs text-gray-400 font-medium mb-1 block text-center">Аксессуары</label>
                    <input
                      type="number"
                      value={cat.accessories}
                      onChange={(e) => updateCategory(index, 'accessories', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-28 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-center text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#FC850D]/30 focus:border-[#FC850D] transition-all"
                    />
                  </div>

                  {/* Result */}
                  <div className="flex items-center gap-3 min-w-[130px]">
                    <div className="text-center ml-auto md:ml-0">
                      <div className={`text-2xl font-bold ${getStatusColor(result.percentage)}`}>
                        {result.percentage}%
                      </div>
                      <div className={`text-xs font-medium ${getStatusColor(result.percentage)}`}>
                        {getStatusLabel(result.percentage)}
                      </div>
                    </div>
                    {categories.length > 1 && (
                      <button
                        onClick={() => removeCategory(index)}
                        className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        title="Удалить категорию"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                    {/* Target marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#FC850D]/40 z-10"
                      style={{ left: `${Math.min(target, 150) / 1.5}%` }}
                    />
                    {/* Progress bar */}
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor(result.percentage)}`}
                      style={{ width: `${getBarWidth(result.percentage)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>0%</span>
                    <span className="text-[#FC850D]/70 font-medium">План: {target}%</span>
                    <span>150%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Category Button */}
        <button
          onClick={addCategory}
          className="w-full bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 hover:text-[#FC850D] hover:border-[#FC850D]/40 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Добавить категорию
        </button>

        {/* Total Summary */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Orange top accent */}
          <div className="h-1 bg-gradient-to-r from-[#FC850D] to-[#FFA940]"></div>
          
          <div className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-[#FC850D] rounded-md flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </span>
              Итоговая статистика
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                <div className="text-3xl font-bold text-gray-900">{totals.totalDevices}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">Всего устройств</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                <div className="text-3xl font-bold text-gray-900">{totals.totalAccessories}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">Всего аксессуаров</div>
              </div>
              <div className="bg-[#FC850D]/5 rounded-lg p-4 text-center border border-[#FC850D]/20">
                <div className={`text-3xl font-bold ${getStatusColor(totals.totalPercentage)}`}>
                  {totals.totalPercentage}%
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">Общий процент</div>
              </div>
            </div>

            {/* Total Progress Bar */}
            <div className="mt-4">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#FC850D]/50 z-10"
                  style={{ left: `${Math.min(target, 150) / 1.5}%` }}
                />
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor(totals.totalPercentage)}`}
                  style={{ width: `${getBarWidth(totals.totalPercentage)}%` }}
                />
              </div>
            </div>

            {/* Recommendation */}
            <div className="mt-4 p-4 rounded-lg border">
              {totals.totalPercentage >= target ? (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-green-700 font-semibold text-sm">Отличный результат!</p>
                    <p className="text-green-600 text-xs mt-0.5">
                      Процент прикрепления {totals.totalPercentage}% превышает плановый показатель {target}%
                    </p>
                  </div>
                </div>
              ) : totals.totalPercentage >= target * 0.7 ? (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#FC850D]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FC850D] text-lg">⚠</span>
                  </div>
                  <div>
                    <p className="text-[#FC850D] font-semibold text-sm">Почти норма</p>
                    <p className="text-gray-600 text-xs mt-0.5">
                      Не хватает {target - totals.totalPercentage}% до плана. Усильте допродажи аксессуаров.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-lg">✗</span>
                  </div>
                  <div>
                    <p className="text-red-600 font-semibold text-sm">Низкий показатель</p>
                    <p className="text-gray-600 text-xs mt-0.5">
                      Процент прикрепления значительно ниже нормы. Необходимо усилить работу по продаже сопутствующих товаров.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-5 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-xs">i</span>
            Формула расчёта
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="text-center font-mono text-sm text-gray-700">
              <span className="text-[#FC850D] font-bold">% прикрепления</span>
              <span className="text-gray-400 mx-2">=</span>
              <span className="text-gray-700">(</span>
              <span className="text-blue-600">Кол-во аксессуаров</span>
              <span className="text-gray-400 mx-1">÷</span>
              <span className="text-purple-600">Кол-во устройств</span>
              <span className="text-gray-700">)</span>
              <span className="text-gray-400 mx-1">×</span>
              <span className="text-gray-700">100%</span>
            </div>
          </div>
          <ul className="mt-3 text-xs text-gray-500 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#FC850D] rounded-full mt-1.5 flex-shrink-0"></span>
              <span><strong className="text-gray-600">Устройства</strong> — количество проданных основных товаров (смартфоны, ноутбуки, планшеты и т.д.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#FC850D] rounded-full mt-1.5 flex-shrink-0"></span>
              <span><strong className="text-gray-600">Аксессуары</strong> — количество проданных сопутствующих товаров (чехлы, зарядные устройства, наушники, защитные стёкла и т.д.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#FC850D] rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Установите <strong className="text-gray-600">целевой показатель</strong> и отслеживайте выполнение по каждой категории</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 pb-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400">
            <div className="bg-[#FC850D] rounded px-1.5 py-0.5">
              <span className="text-white font-black text-[10px]">DNS</span>
            </div>
            <span>Калькулятор сопутствующего товара • {new Date().getFullYear()}</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
