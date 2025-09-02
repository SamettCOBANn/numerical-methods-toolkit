"""
12. Comparative Analysis and Case Study
"""
import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import interp1d, CubicSpline

def demo():
    print("[12] Comparative Analysis and Case Study")
    # Aynı veriyle farklı interpolasyonlar
    x = np.array([0, 1, 2, 3, 4, 5])
    y = np.array([15, 17, 20, 22, 21, 19])
    xnew = np.linspace(0, 5, 10)
    lin_interp = interp1d(x, y)
    cubic_interp = CubicSpline(x, y)
    plt.plot(x, y, 'o', label='Veri')
    plt.plot(xnew, lin_interp(xnew), label='Lineer')
    plt.plot(xnew, cubic_interp(xnew), label='Kübik Spline')
    plt.title('Karşılaştırmalı Interpolasyon')
    plt.legend()
    plt.show()
    print("Lineer ve kübik spline farkı grafikle gösterildi.")
