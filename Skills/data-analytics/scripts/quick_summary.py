#!/usr/bin/env python3
"""Quick data summary — prints stats and saves overview chart."""

import sys
import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
matplotlib.rcParams['font.sans-serif'] = ['Microsoft YaHei', 'SimHei', 'FangSong']
matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime


def load_file(filepath):
    """Auto-detect file type and load."""
    ext = os.path.splitext(filepath)[1].lower()
    if ext == '.csv':
        return pd.read_csv(filepath)
    elif ext == '.xlsx' or ext == '.xls':
        return pd.read_excel(filepath)
    elif ext == '.json':
        return pd.read_json(filepath)
    else:
        raise ValueError(f"Unsupported file type: {ext}")


def summarize(df):
    """Print a comprehensive data summary."""
    print(f"\n{'='*60}")
    print(f"  DATA SUMMARY — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}\n")
    
    print(f"数据形状: {df.shape[0]} 行 × {df.shape[1]} 列\n")
    
    # Data types
    print("--- 数据类型 ---")
    print(df.dtypes.to_string())
    print()
    
    # Missing values
    print("--- 缺失值 ---")
    missing = df.isnull().sum()
    missing_pct = (missing / len(df) * 100).round(2)
    missing_df = pd.DataFrame({'数量': missing, '百分比': missing_pct})
    missing_df = missing_df[missing_df['数量'] > 0]
    if missing_df.empty:
        print("  未发现缺失值。")
    else:
        print(missing_df.to_string())
    print()
    
    # Numeric columns
    num_cols = df.select_dtypes(include=['number']).columns
    if len(num_cols) > 0:
        print("--- 数值列统计摘要 ---")
        print(df[num_cols].describe().round(2).to_string())
        print()
        
        # Correlation
        if len(num_cols) >= 2:
            print("--- 相关性矩阵 (Top 10) ---")
            corr = df[num_cols].corr()
            top_corr = corr.abs().unstack()
            top_corr = top_corr[top_corr < 1.0].sort_values(ascending=False)
            print(top_corr.head(10).to_string())
            print()
    
    # Categorical columns
    cat_cols = df.select_dtypes(include=['object', 'category', 'string']).columns
    if len(cat_cols) > 0:
        print("--- 分类列 Top 5 ---")
        for col in cat_cols[:5]:
            top = df[col].value_counts().head(5)
            print(f"\n  {col}:")
            for val, cnt in top.items():
                print(f"    {val}: {cnt}")
        print()


def save_overview_chart(df, output_dir='.'):
    """Generate and save an overview chart."""
    os.makedirs(output_dir, exist_ok=True)
    
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    if len(num_cols) == 0:
        print("无可绘制的数值列。")
        return
    
    # Correlation heatmap
    if len(num_cols) >= 2:
        fig, ax = plt.subplots(figsize=(10, 8))
        corr = df[num_cols].corr()
        sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', 
                    center=0, ax=ax, square=True)
        plt.title('相关性热力图', fontsize=14, pad=15)
        plt.tight_layout()
        out_path = os.path.join(output_dir, 'correlation_heatmap.png')
        fig.savefig(out_path, dpi=150, bbox_inches='tight')
        plt.close(fig)
        print(f"已保存: {out_path}")
    
    # Distribution plots
    n_cols = min(len(num_cols), 4)
    n_rows = (len(num_cols) + n_cols - 1) // n_cols
    fig, axes = plt.subplots(n_rows, n_cols, figsize=(5*n_cols, 4*n_rows))
    if n_rows == 1 and n_cols == 1:
        axes = axes.reshape(1, 1)
    axes = axes.flatten()
    
    for i, col in enumerate(num_cols):
        sns.histplot(df[col].dropna(), kde=True, ax=axes[i], color='steelblue')
        axes[i].set_title(col, fontsize=12)
    
    for j in range(i+1, len(axes)):
        axes[j].set_visible(False)
    
    plt.suptitle('分布概览', fontsize=14, y=1.02)
    plt.tight_layout()
    out_path = os.path.join(output_dir, 'distributions.png')
    fig.savefig(out_path, dpi=150, bbox_inches='tight')
    plt.close(fig)
    print(f"已保存: {out_path}")


def main():
    if len(sys.argv) < 2:
        print("用法: python quick_summary.py <文件路径> [--output <输出目录>]")
        sys.exit(1)
    
    filepath = sys.argv[1]
    output_dir = '.'
    
    if '--output' in sys.argv:
        idx = sys.argv.index('--output')
        if idx + 1 < len(sys.argv):
            output_dir = sys.argv[idx + 1]
    
    if not os.path.exists(filepath):
        print(f"文件不存在: {filepath}")
        sys.exit(1)
    
    try:
        df = load_file(filepath)
    except Exception as e:
        print(f"读取文件出错: {e}")
        sys.exit(1)
    
    summarize(df)
    save_overview_chart(df, output_dir)
    
    print(f"\n{'='*60}")
    print("  完成!")
    print(f"{'='*60}\n")


if __name__ == '__main__':
    main()
