"""
3. Interpolation Techniques: Lineer ve Kübik Spline
"""
import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import interp1d, CubicSpline

def demo():
    print("[3] Interpolation Techniques")
    # Örnek sıcaklık verisi
    x = np.array([0, 1, 2, 3, 4, 5])
    y = np.array([15, 17, 20, 22, 21, 19])
    xnew = np.linspace(0, 5, 100)
    lin_interp = interp1d(x, y)
    cubic_interp = CubicSpline(x, y)
    plt.plot(x, y, 'o', label='Veri')
    plt.plot(xnew, lin_interp(xnew), label='Lineer')
    plt.plot(xnew, cubic_interp(xnew), label='Kübik Spline')
    plt.title('Sıcaklık Interpolasyonu')
    plt.legend()
    plt.show()
