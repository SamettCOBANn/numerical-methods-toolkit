"""
4. Numerical Differentiation: Sonlu fark yöntemleri
"""
import numpy as np
import matplotlib.pyplot as plt

def demo():
    print("[4] Numerical Differentiation")
    x = np.linspace(0, 10, 11)
    y = np.sin(x)
    h = x[1] - x[0]
    # Forward
    dy_forward = (y[1:] - y[:-1]) / h
    # Backward
    dy_backward = (y[1:] - y[:-1]) / h
    # Central
    dy_central = (y[2:] - y[:-2]) / (2*h)
    plt.plot(x, y, 'o-', label='f(x)')
    plt.plot(x[:-1], dy_forward, 's-', label='Forward')
    plt.plot(x[1:], dy_backward, 'd-', label='Backward')
    plt.plot(x[1:-1], dy_central, '^-', label='Central')
    plt.legend()
    plt.title('Sonlu Fark Türev Yöntemleri')
    plt.show()
