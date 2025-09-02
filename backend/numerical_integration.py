"""
5. Numerical Integration: Trapez, Simpson, quad
"""
import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import simpson, quad

def demo():
    print("[5] Numerical Integration")
    x = np.linspace(0, 10, 11)
    y = np.sin(x)
    # Trapez
    trapz_val = np.trapz(y, x)
    # Simpson
    simpson_val = simpson(y, x)
    # quad
    quad_val, _ = quad(np.sin, 0, 10)
    print(f"Trapez: {trapz_val}, Simpson: {simpson_val}, Quad: {quad_val}")
    plt.plot(x, y, 'o-', label='f(x)')
    plt.fill_between(x, 0, y, alpha=0.2)
    plt.title('Numerical Integration')
    plt.legend()
    plt.show()
