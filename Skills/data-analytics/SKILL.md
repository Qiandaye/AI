---
name: data-analytics
description: "Complete data analysis toolkit — CSV/Excel/PDF reading, statistical analysis, data cleaning, visualization, and reporting. Supports pandas, matplotlib, seaborn, plotly, scipy, numpy. Actions: analyze, explore, clean, visualize, summarize, export charts, generate reports."
---

# Data Analytics Skill

Complete data analysis toolkit for exploring, cleaning, analyzing, visualizing, and reporting on datasets.

## When to Apply

This Skill must be invoked when the task involves:

- Analyzing any dataset (CSV, Excel, JSON, SQL, PDF, text files)
- Statistical analysis (descriptive stats, correlations, hypothesis testing)
- Data cleaning (missing values, duplicates, outliers, type conversion)
- Creating visualizations (charts, plots, dashboards)
- Generating data reports or summaries
- Exploring relationships between variables
- Time series analysis
- Any data transformation or aggregation task

## Prerequisites

All dependencies are pre-installed:

| Package | Version | Purpose |
|---------|---------|---------|
| pandas | 3.0.3 | Data manipulation & analysis |
| matplotlib | 3.11.0 | Static plotting |
| seaborn | Latest | Statistical visualizations |
| plotly | 6.8.0 | Interactive charts |
| scipy | 1.17.1 | Scientific computing & statistics |
| numpy | 2.4.6 | Numerical computing |

## Workflow

### Step 1: Load & Explore

```python
import pandas as pd
df = pd.read_csv('data.csv')  # or pd.read_excel(), pd.read_json()
print(df.info())
print(df.describe())
print(df.head())
```

### Step 2: Data Cleaning

```python
# Check missing values
print(df.isnull().sum())

# Handle missing data
df.dropna(inplace=True)  # or df.fillna(...)

# Remove duplicates
df.drop_duplicates(inplace=True)

# Fix types
df['date'] = pd.to_datetime(df['date'])
```

### Step 3: Analysis

```python
# Descriptive statistics
df.describe()

# Correlations
df.corr()

# Groupby aggregations
df.groupby('category')['value'].agg(['mean', 'sum', 'count'])
```

### Step 4: Visualization

```python
import matplotlib.pyplot as plt
import seaborn as sns

# Basic chart
sns.histplot(df['column'], kde=True)
plt.savefig('chart.png', dpi=150, bbox_inches='tight')

# Interactive chart with plotly
import plotly.express as px
fig = px.bar(df, x='category', y='value')
fig.write_html('chart.html')
```

### Step 5: Export Results

```python
# Export cleaned data
df.to_csv('cleaned_data.csv', index=False)

# Export summary report
df.describe().to_csv('summary_report.csv')
```

## Chart Types Reference

| Analysis Goal | Chart Type | Library |
|---------------|-----------|---------|
| Distribution | Histogram, KDE, Box plot | seaborn |
| Comparison | Bar chart, Column chart | matplotlib |
| Trend over time | Line chart, Area chart | matplotlib/seaborn |
| Relationship | Scatter plot, Bubble chart | plotly |
| Composition | Pie chart, Donut, Stacked bar | matplotlib |
| Correlation | Heatmap, Correlation matrix | seaborn |
| Geographic | Choropleth, Scatter on map | plotly |
| Funnel | Funnel chart | plotly |

## Output Standards

- Save charts as **PNG** (300 DPI) for static use
- Save charts as **HTML** (plotly) for interactive use
- Always use `bbox_inches='tight'` to prevent cutoff
- Use Chinese labels when data is in Chinese
- Include axis labels, titles, and legends on all charts
- Colorblind-friendly palettes (seaborn default)

## Common Patterns

### Quick Data Summary Script

```python
python "C:\Users\Administrator\.codex\skills\data-analytics\scripts\quick_summary.py" "path/to/file.csv"
```

### Batch Chart Generation

```python
python "C:\Users\Administrator\.codex\skills\data-analytics\scripts\batch_charts.py" "path/to/file.csv" --output "charts/"
```

## Tips

- Always check data types before analysis
- Handle missing values explicitly — don't ignore them
- Use `df.info()` and `df.describe()` as first steps
- For large datasets (>1M rows), use sampling or aggregation
- Save intermediate cleaned data for reproducibility
- Use seaborn color palettes for accessible charts
