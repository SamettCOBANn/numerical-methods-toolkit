"""
2. Root Finding: Bisection, Newton-Raphson, Secant
Örnek: f(x) = x^3 - x - 2
"""
import numpy as np
import matplotlib.pyplot as plt

def f(x):
    return x**3 - x - 2

def bisection(a, b, tol=1e-6, max_iter=100):
    for i in range(max_iter):
        c = (a + b) / 2
        if f(c) == 0 or (b - a) / 2 < tol:
            return c
        if np.sign(f(c)) == np.sign(f(a)):
            a = c
        else:
            b = c
    return c

def newton_raphson(x0, tol=1e-6, max_iter=100):
    x = x0
    for i in range(max_iter):
        fx = f(x)
        dfx = 3*x**2 - 1
        if abs(fx) < tol:
            return x
        x = x - fx/dfx
    return x

def secant(x0, x1, tol=1e-6, max_iter=100):
    for i in range(max_iter):
        if abs(f(x1) - f(x0)) < 1e-12:
            return x1
        x2 = x1 - f(x1)*(x1-x0)/(f(x1)-f(x0))
        if abs(x2 - x1) < tol:
            return x2
        x0, x1 = x1, x2
    return x1

def demo():
    print("[2] Root Finding")
    root_bis = bisection(1, 2)
    root_newton = newton_raphson(1.5)
    root_secant = secant(1, 2)
    print(f"Bisection: {root_bis}")
    print(f"Newton-Raphson: {root_newton}")
    print(f"Secant: {root_secant}")
    # Grafik
    x = np.linspace(1, 2, 100)
    plt.plot(x, f(x), label='f(x)')
    plt.axhline(0, color='gray', linestyle='--')
    plt.scatter([root_bis, root_newton, root_secant], [0,0,0], color='red', label='Kökler')
    plt.legend()
    plt.title('Kök Bulma Yöntemleri')
    plt.show()
