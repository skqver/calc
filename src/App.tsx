import { useState, useMemo, useEffect } from 'react';

interface CategoryResult {
  name: string;
  devices: number;
  accessories: number;
  percentage: number;
}

type Theme = 'light' | 'dark';

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('dns-calc-theme') as Theme) || 'light';
    }
    return 'light';
  });

  const [categories, setCategories] = useState<{ name: string; devices: string; accessories: string }[]>([
    { name: 'Смартфоны', devices: '', accessories: '' },
    { name: 'Ноутбуки', devices: '', accessories: '' },
    { name: 'Планшеты', devices: '', accessories: '' },
  ]);

  const [targetPercent, setTargetPercent] = useState<string>('90');

  useEffect(() => {
    localStorage.setItem('dns-calc-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Theme colors
  const t = useMemo(() => {
    const isDark = theme === 'dark';
    return {
      bg: isDark ? 'bg-[#1A1A1A]' : 'bg-[#F5F5F5]',
      card: isDark ? 'bg-[#2A2A2A]' : 'bg-white',
      cardBorder: isDark ? 'border-[#3A3A3A]' : 'border-gray-100',
      cardHover: isDark ? 'hover:border-[#4A4A4A]' : 'hover:shadow-md',
      headerBg: isDark ? 'bg-[#222222]' : 'bg-white',
      headerBorder: isDark ? 'border-[#3A3A3A]' : 'border-gray-100',
      input: isDark ? 'bg-[#1E1E1E] border-[#3A3A3A] text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400',
      inputFocus: 'focus:outline-none focus:ring-2 focus:ring-[#FC850D]/30 focus:border-[#FC850D]',
      text: isDark ? 'text-gray-100' : 'text-gray-900',
      textSecondary: isDark ? 'text-gray-400' : 'text-gray-500',
      textMuted: isDark ? 'text-gray-500' : 'text-gray-400',
      textLabel: isDark ? 'text-gray-300' : 'text-gray-700',
      progressBar: isDark ? 'bg-[#333333]' : 'bg-gray-100',
      statCard: isDark ? 'bg-[#1E1E1E] border-[#3A3A3A]' : 'bg-gray-50 border-gray-100',
      statCardAccent: isDark ? 'bg-[#FC850D]/10 border-[#FC850D]/20' : 'bg-[#FC850D]/5 border-[#FC850D]/20',
      infoBg: isDark ? 'bg-[#1E1E1E] border-[#3A3A3A]' : 'bg-gray-50 border-gray-100',
      addBtn: isDark
        ? 'bg-[#2A2A2A] border-[#3A3A3A] text-gray-400 hover:text-[#FC850D] hover:border-[#FC850D]/40'
        : 'bg-white border-gray-200 text-gray-400 hover:text-[#FC850D] hover:border-[#FC850D]/40',
      targetCard: isDark
        ? 'bg-[#2A2A2A] border-[#3A3A3A]'
        : 'bg-white border-gray-100',
      targetIconBg: isDark ? 'bg-[#FC850D]/20' : 'bg-[#FC850D]/10',
      deleteBtn: isDark
        ? 'text-gray-600 hover:text-red-400 hover:bg-red-900/20'
        : 'text-gray-300 hover:text-red-400 hover:bg-red-50',
      recommendationBg: isDark ? 'border-[#3A3A3A]' : 'border',
      recGreenBg: isDark ? 'bg-green-900/20' : 'bg-green-50',
      recOrangeBg: isDark ? 'bg-[#FC850D]/10' : 'bg-[#FC850D]/10',
      recRedBg: isDark ? 'bg-red-900/20' : 'bg-red-50',
      footer: isDark ? 'text-gray-600' : 'text-gray-400',
      summaryCard: isDark
        ? 'bg-[#2A2A2A] border-[#3A3A3A]'
        : 'bg-white border-gray-100',
      infoCard: isDark
        ? 'bg-[#2A2A2A] border-[#3A3A3A]'
        : 'bg-white border-gray-100',
    };
  }, [theme]);

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

  const target = parseInt(targetPercent) || 90;

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
    if (percentage >= target) return 'text-green-500';
    if (percentage >= target * 0.7) return 'text-[#FC850D]';
    return 'text-red-400';
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
    <div className={`min-h-screen transition-colors duration-300 ${t.bg} ${t.text}`}>
      {/* Header */}
      <header className={`${t.headerBg} border-b ${t.headerBorder} sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* DNS Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-[#FC850D] rounded-lg px-3 py-1.5">
              <span className="text-white font-black text-xl tracking-tight">DNS</span>
            </div>
            <span className={`hidden sm:inline text-sm ${t.textSecondary} border-l ${t.headerBorder} pl-3`}>
              Калькулятор сопутствующего товара
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#FC850D]' : 'bg-gray-200'
            } flex items-center px-1`}
            title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
              }`}
            >
              {theme === 'dark' ? (
                <svg className="w-3 h-3 text-[#FC850D]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-[#FC850D]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className={`text-2xl md:text-3xl font-bold ${t.text}`}>
            Расчёт процента сопутствующего товара
          </h1>
          <p className={`${t.textSecondary} text-sm mt-1`}>
            Контроль прикрепления аксессуаров к основным устройствам по категориям
          </p>
        </div>

        {/* Target Setting Card */}
        <div className={`${t.targetCard} rounded-xl shadow-sm border p-5 mb-5 transition-colors duration-300`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${t.targetIconBg} rounded-lg flex items-center justify-center`}>
                <span className="text-[#FC850D] text-sm font-bold">%</span>
              </div>
              <label className={`text-sm font-semibold ${t.textLabel}`}>
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
                className={`w-20 rounded-lg px-3 py-2 text-center font-semibold transition-all ${t.input} ${t.inputFocus}`}
              />
              <span className={`${t.textMuted} font-medium`}>%</span>
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
                className={`${t.card} rounded-xl shadow-sm border ${t.cardBorder} p-5 ${t.cardHover} transition-all duration-300`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Category Name */}
                  <div className="flex-1">
                    <label className={`text-xs ${t.textMuted} font-medium mb-1 block`}>Категория</label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => updateCategory(index, 'name', e.target.value)}
                      placeholder="Название категории"
                      className={`w-full rounded-lg px-4 py-2.5 transition-all ${t.input} ${t.inputFocus}`}
                    />
                  </div>

                  {/* Devices Input */}
                  <div>
                    <label className={`text-xs ${t.textMuted} font-medium mb-1 block text-center`}>Устройства</label>
                    <input
                      type="number"
                      value={cat.devices}
                      onChange={(e) => updateCategory(index, 'devices', e.target.value)}
                      placeholder="0"
                      min="0"
                      className={`w-28 rounded-lg px-3 py-2.5 text-center font-medium transition-all ${t.input} ${t.inputFocus}`}
                    />
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex items-center pt-5">
                    <svg className={`w-5 h-5 ${t.textMuted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* Accessories Input */}
                  <div>
                    <label className={`text-xs ${t.textMuted} font-medium mb-1 block text-center`}>Аксессуары</label>
                    <input
                      type="number"
                      value={cat.accessories}
                      onChange={(e) => updateCategory(index, 'accessories', e.target.value)}
                      placeholder="0"
                      min="0"
                      className={`w-28 rounded-lg px-3 py-2.5 text-center font-medium transition-all ${t.input} ${t.inputFocus}`}
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
                        className={`${t.deleteBtn} transition-colors p-1.5 rounded-lg`}
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
                  <div className={`h-2 ${t.progressBar} rounded-full overflow-hidden relative transition-colors duration-300`}>
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[#FC850D]/40 z-10"
                      style={{ left: `${Math.min(target, 150) / 1.5}%` }}
                    />
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColor(result.percentage)}`}
                      style={{ width: `${getBarWidth(result.percentage)}%` }}
                    />
                  </div>
                  <div className={`flex justify-between text-[10px] ${t.textMuted} mt-1`}>
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
          className={`w-full border-2 border-dashed rounded-xl p-4 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm ${t.addBtn}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Добавить категорию
        </button>

        {/* Total Summary */}
        <div className={`mt-6 ${t.summaryCard} rounded-xl shadow-sm border overflow-hidden transition-colors duration-300`}>
          {/* Orange top accent */}
          <div className="h-1 bg-gradient-to-r from-[#FC850D] to-[#FFA940]"></div>

          <div className="p-5">
            <h2 className={`text-lg font-bold ${t.text} mb-4 flex items-center gap-2`}>
              <span className="w-6 h-6 bg-[#FC850D] rounded-md flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </span>
              Итоговая статистика
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`${t.statCard} rounded-lg p-4 text-center border transition-colors duration-300`}>
                <div className={`text-3xl font-bold ${t.text}`}>{totals.totalDevices}</div>
                <div className={`text-xs ${t.textSecondary} mt-1 font-medium`}>Всего устройств</div>
              </div>
              <div className={`${t.statCard} rounded-lg p-4 text-center border transition-colors duration-300`}>
                <div className={`text-3xl font-bold ${t.text}`}>{totals.totalAccessories}</div>
                <div className={`text-xs ${t.textSecondary} mt-1 font-medium`}>Всего аксессуаров</div>
              </div>
              <div className={`${t.statCardAccent} rounded-lg p-4 text-center border transition-colors duration-300`}>
                <div className={`text-3xl font-bold ${getStatusColor(totals.totalPercentage)}`}>
                  {totals.totalPercentage}%
                </div>
                <div className={`text-xs ${t.textSecondary} mt-1 font-medium`}>Общий процент</div>
              </div>
            </div>

            {/* Total Progress Bar */}
            <div className="mt-4">
              <div className={`h-3 ${t.progressBar} rounded-full overflow-hidden relative transition-colors duration-300`}>
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
            <div className={`mt-4 p-4 rounded-lg border ${t.recommendationBg} transition-colors duration-300`}>
              {totals.totalPercentage >= target ? (
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${t.recGreenBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-green-500 text-lg">✓</span>
                  </div>
                  <div>
                    <p className="text-green-500 font-semibold text-sm">Отличный результат!</p>
                    <p className={`${t.textSecondary} text-xs mt-0.5`}>
                      Процент прикрепления {totals.totalPercentage}% превышает плановый показатель {target}%
                    </p>
                  </div>
                </div>
              ) : totals.totalPercentage >= target * 0.7 ? (
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${t.recOrangeBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-[#FC850D] text-lg">⚠</span>
                  </div>
                  <div>
                    <p className="text-[#FC850D] font-semibold text-sm">Почти норма</p>
                    <p className={`${t.textSecondary} text-xs mt-0.5`}>
                      Не хватает {target - totals.totalPercentage}% до плана. Усильте допродажи аксессуаров.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${t.recRedBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-red-400 text-lg">✗</span>
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold text-sm">Низкий показатель</p>
                    <p className={`${t.textSecondary} text-xs mt-0.5`}>
                      Процент прикрепления значительно ниже нормы. Необходимо усилить работу по продаже сопутствующих товаров.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className={`mt-5 ${t.infoCard} rounded-xl shadow-sm border p-5 transition-colors duration-300`}>
          <h3 className={`text-sm font-bold ${t.textLabel} mb-3 flex items-center gap-2`}>
            <span className={`w-5 h-5 ${theme === 'dark' ? 'bg-[#3A3A3A]' : 'bg-gray-100'} rounded flex items-center justify-center text-xs`}>i</span>
            Формула расчёта
          </h3>
          <div className={`${t.infoBg} rounded-lg p-4 border transition-colors duration-300`}>
            <div className={`text-center font-mono text-sm ${t.text}`}>
              <span className="text-[#FC850D] font-bold">% прикрепления</span>
              <span className={`${t.textMuted} mx-2`}>=</span>
              <span>(</span>
              <span className="text-blue-400">Кол-во аксессуаров</span>
              <span className={`${t.textMuted} mx-1`}>÷</span>
              <span className="text-purple-400">Кол-во устройств</span>
              <span>)</span>
              <span className={`${t.textMuted} mx-1`}>×</span>
              <span>100%</span>
            </div>
          </div>
          <ul className={`mt-3 text-xs ${t.textSecondary} space-y-1.5`}>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#FC850D] rounded-full mt-1.5 flex-shrink-0"></span>
              <span><strong className={t.textLabel}>Устройства</strong> — количество проданных основных товаров (смартфоны, ноутбуки, планшеты и т.д.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#FC850D] rounded-full mt-1.5 flex-shrink-0"></span>
              <span><strong className={t.textLabel}>Аксессуары</strong> — количество проданных сопутствующих товаров (чехлы, зарядные устройства, наушники, защитные стёкла и т.д.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-[#FC850D] rounded-full mt-1.5 flex-shrink-0"></span>
              <span>Установите <strong className={t.textLabel}>целевой показатель</strong> и отслеживайте выполнение по каждой категории</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 pb-6 text-center">
          <div className={`inline-flex items-center gap-2 text-xs ${t.footer}`}>
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
