# 📊 Калькулятор сопутствующего товара (DNS Style)

Калькулятор для расчёта процента прикрепления аксессуаров к основным устройствам в стиле DNS.

## 🚀 Как опубликовать на GitHub Pages

### Шаг 1 — Создайте репозиторий

1. Откройте [github.com/new](https://github.com/new)
2. Название: `dns-accessories-calculator` (или любое другое)
3. Выберите **Public**
4. **НЕ** ставьте галочку "Add a README" — он уже есть
5. Нажмите **Create repository**

### Шаг 2 — Загрузите код

Откройте терминал в папке проекта и выполните:

```bash
git init
git add .
git commit -m "DNS accessories calculator"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/dns-accessories-calculator.git
git push -u origin main
```

> Замените `ВАШ_ЛОГИН` на ваш логин GitHub.

### Шаг 3 — Включите GitHub Pages

1. Перейдите в репозиторий на GitHub
2. Откройте **Settings** → **Pages**
3. В разделе **Source** выберите **GitHub Actions**
4. Готово! Workflow запустится автоматически

### Шаг 4 — Откройте калькулятор

Через 1-2 минуты сайт будет доступен по адресу:

```
https://ВАШ_ЛОГИН.github.io/dns-accessories-calculator/
```

---

## 📐 Формула расчёта

```
% прикрепления = (Кол-во аксессуаров ÷ Кол-во устройств) × 100%
```

## 🛠 Технологии

- React + TypeScript
- Vite
- Tailwind CSS
