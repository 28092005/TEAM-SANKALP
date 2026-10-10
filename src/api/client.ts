from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Tuple

from backend.app.config import settings


PRODUCTS = [
    ('PRD-101', 'Smartphones Ultra 5G', 'Electronics', 42999, 28000),
    ('PRD-102', 'Smartphones Neo', 'Electronics', 18999, 12500),
    ('PRD-103', 'Laptop Pro 16"', 'Electronics', 89999, 62000),
    ('PRD-104', 'UltraBook OLED 14"', 'Electronics', 64999, 45000),
    ('PRD-105', 'Tablet Air 11"', 'Electronics', 32999, 22000),
    ('PRD-106', 'Noise-Cancelling Headphones Pro', 'Electronics', 14999, 8500),
    ('PRD-107', 'Smart 4K UHD TV 55"', 'Electronics', 47999, 32000),
    ('PRD-201', 'Organic Staples Pack 10kg', 'Grocery', 1850, 1200),
    ('PRD-202', 'Cold-Pressed Cooking Oil 5L', 'Grocery', 1450, 950),
    ('PRD-203', 'Premium Arabica Coffee Beans 1kg', 'Grocery', 1200, 720),
    ('PRD-204', 'Exotic Nuts & Dry Fruits 1kg', 'Grocery', 1650, 1100),
    ('PRD-205', 'Artisanal Spices Heritage Box', 'Grocery', 950, 580),
    ('PRD-206', 'Organic Honey & Superfoods', 'Grocery', 850, 510),
    ('PRD-301', 'Executive Formal Blazer', 'Fashion', 6499, 3200),
    ('PRD-302', 'Casual Denim Jacket', 'Fashion', 3299, 1600),
    ('PRD-303', 'Pure Silk Traditional Saree', 'Fashion', 11999, 6500),
    ('PRD-304', 'Performance Running Shoes', 'Fashion', 4999, 2400),
    ('PRD-305', 'Leather Oxford Shoes', 'Fashion', 5499, 2700),
    ('PRD-306', 'Linen Casual Shirts (Set of 2)', 'Fashion', 2899, 1400),
    ('PRD-401', 'Ergonomic Mesh Chair Pro', 'Accessories', 13999, 8000),
    ('PRD-402', 'Wireless Ergonomic Mouse & Keyboard', 'Accessories', 3499, 1900),
    ('PRD-403', 'Thunderbolt 4 Docking Station', 'Accessories', 9499, 5500),
    ('PRD-404', 'Air Purifier Max 3', 'Accessories', 17499, 11000),
    ('PRD-405', 'Smart LED Desk Lamp Pro', 'Accessories', 2799, 1500),
]


def seed() -> None:
    db_path = Path(settings.SALES_DB_PATH)
    db_path.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(db_path)
    conn.execute('PRAGMA journal_mode=WAL;')
    conn.execute('PRAGMA synchronous=NORMAL;')

    conn.execute('DROP TABLE IF EXISTS orders')
    conn.execute('DROP TABLE IF EXISTS customers')
    conn.execute('DROP TABLE IF EXISTS products')
    conn.execute('DROP TABLE IF EXISTS regional_metrics')
    conn.execute('DROP TABLE IF EXISTS monthly_trend')

    conn.execute('''
        CREATE TABLE products (
            id TEXT PRIMARY KEY,
            name TEXT,
            category TEXT,
            price INTEGER,
            cost INTEGER
        )
    ''')
    conn.executemany(
        'INSERT INTO products (id, name, category, price, cost) VALUES (?, ?, ?, ?, ?)',
        PRODUCTS,
    )

    conn.execute('''
        CREATE TABLE customers (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            location TEXT,
            region TEXT,
            orders_count INTEGER,
            total_spent INTEGER,
            status TEXT,
            type TEXT,
            joined_date TEXT,
            last_order_date TEXT
        )
    ''')

    customers: List[Tuple[Any, ...]] = []
    for i in range(1, 501):
        first = ['Aarav', 'Tanvi', 'Siddharth', 'Ishaan', 'Riya', 'Manish', 'Pooja', 'Nikhil'][i % 8]
        last = ['Patel', 'Reddy', 'Joshi', 'Malhotra', 'Kapoor', 'Bansal', 'Hegde', 'Bose'][i % 8]
        region = ['Karnataka', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Others'][i % 5]
        cust_type = 'Enterprise' if i % 7 == 0 else 'VIP' if i % 5 == 0 else 'Retail'
        customers.append((
            f'CUST-{1000 + i:04d}',
            f'{first} {last}',
            f'{first.lower()}.{last.lower()}{i}@gmail.com',
            f'Bangalore, KA' if region == 'Karnataka' else f'New Delhi, DL' if region == 'Delhi' else 'Mumbai, MH' if region == 'Maharashtra' else 'Chennai, TN' if region == 'Tamil Nadu' else 'Hyderabad, TS',
            region,
            24 + (i % 30) if cust_type == 'Enterprise' else 14 + (i % 15) if cust_type == 'VIP' else 3 + (i % 10),
            (24 + (i % 30)) * 45000 if cust_type == 'Enterprise' else (14 + (i % 15)) * 18000 if cust_type == 'VIP' else (3 + (i % 10)) * 4200,
            'Active',
            cust_type,
            f'2024-{(i%12)+1:02d}-{(i%27)+1:02d}',
            f'2026-0{(i%9)+1}-{(i%25)+1:02d}',
        ))
    conn.executemany('INSERT INTO customers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', customers)

    conn.execute('''
        CREATE TABLE orders (
            id TEXT PRIMARY KEY,
            customer TEXT,
            customer_id TEXT,
            product TEXT,
            product_id TEXT,
            amount INTEGER,
            status TEXT,
            region TEXT,
            date TEXT,
            payment_method TEXT
        )
    ''')

    order_rows = []
    for month in ['2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']:
        for i in range(85):
            order_id = 5000 + (len(order_rows) + 1)
            cust = customers[(i * 3) % len(customers)]
            product = PRODUCTS[(i * 2) % len(PRODUCTS)]
            region = cust[4]
            rand_mod = (i + order_id) % 100
            if region == 'Delhi' and month == '2026-09':
                status = 'Cancelled' if rand_mod < 29 else 'Processing' if rand_mod < 45 else 'Delivered'
            else:
                status = 'Cancelled' if rand_mod < 8 else 'Processing' if rand_mod < 18 else 'Returned' if rand_mod < 22 else 'Delivered'
            order_rows.append((
                f'ORD-{order_id}',
                cust[1],
                cust[0],
                product[1],
                product[0],
                product[3] * (1 + (i % 3)),
                status,
                region,
                f'{month}-{(i % 28) + 1:02d}',
                ['UPI / NetBanking', 'Credit Card', 'Corporate PO', 'Debit Card', 'Cash on Delivery'][i % 5],
            ))
    conn.executemany('INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', order_rows)

    conn.execute('''
        CREATE TABLE regional_metrics (
            region TEXT,
            revenue_cr REAL,
            percentage INTEGER,
            orders INTEGER,
            growth REAL,
            top_product TEXT,
            active_customers INTEGER
        )
    ''')
    conn.executemany(
        'INSERT INTO regional_metrics VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
            ('Karnataka', 42.3, 32, 2694, 14.2, 'Laptop Pro 16"', 540),
            ('Delhi', 31.1, 24, 2020, 11.2, 'Smartphones Ultra 5G', 430),
            ('Maharashtra', 23.4, 18, 1700, 18.5, 'Organic Staples Pack 10kg', 380),
            ('Tamil Nadu', 15.8, 12, 1460, 9.5, 'Laptop Pro 16"', 320),
            ('Others', 18.7, 14, 1495, 9.5, 'Organic Staples Pack 10kg', 300),
        ],
    )

    conn.execute('''
        CREATE TABLE monthly_trend (
            month TEXT,
            revenue_cr REAL,
            orders INTEGER,
            last_year_revenue_cr REAL
        )
    ''')
    months = [
        ('Oct', 18.4, 850, 15.5), ('Nov', 20.1, 880, 16.8), ('Dec', 22.4, 930, 18.8),
        ('Jan', 17.3, 800, 14.6), ('Feb', 17.6, 820, 14.8), ('Mar', 18.9, 840, 15.9),
        ('Apr', 18.1, 830, 15.2), ('May', 19.0, 840, 16.0), ('Jun', 19.7, 850, 16.6),
        ('Jul', 21.4, 870, 17.9), ('Aug', 24.8, 910, 20.8), ('Sep', 22.0, 870, 18.5),
    ]
    conn.executemany('INSERT INTO monthly_trend VALUES (?, ?, ?, ?)', months)

    conn.commit()
    conn.close()


if __name__ == '__main__':
    seed()
    print(f'Seeded SQLite database at {settings.SALES_DB_PATH}')
