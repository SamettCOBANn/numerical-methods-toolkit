"""
1. Error Analysis and Floating-Point Precision
Yuvarlama hataları ve sonlu hassasiyetin etkileri, grafiklerle gösterim.
"""
import numpy as np
import matplotlib.pyplot as plt

def demo():
    print("[1] Error Analysis and Floating-Point Precision")
    # Yuvarlama hatası örneği
    a = 0.1
    b = 0.2
    c = 0.3
    print(f"0.1 + 0.2 == 0.3? {a + b == c}")
    print(f"Gerçek değer: {a + b}")
    # Hata yayılımı
    x = 1.0
    errors = []
    for i in range(20):
        x = x / 3 * 3
        errors.append(abs(1.0 - x))
    plt.figure()
    plt.plot(errors, marker='o')
    plt.title('Hata Yayılımı (1.0 -> 1/3 -> *3)')
    plt.xlabel('İterasyon')
    plt.ylabel('Hata')
    plt.grid()
    plt.show()
    print("Hata yayılımı grafiği gösterildi.")
