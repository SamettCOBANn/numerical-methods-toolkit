"""
11. Visualization & Documentation
"""
import numpy as np
import matplotlib.pyplot as plt

def demo():
    print("[11] Visualization & Documentation")
    x = np.linspace(0, 10, 100)
    y = np.sin(x)
    plt.plot(x, y, label='sin(x)')
    plt.title('Örnek Grafik')
    plt.xlabel('x')
    plt.ylabel('y')
    plt.legend()
    plt.show()
