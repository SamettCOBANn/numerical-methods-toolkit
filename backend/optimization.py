"""
8. Optimization Techniques
"""
import numpy as np
from scipy.optimize import minimize

def demo():
    print("[8] Optimization Techniques")
    # Sıcaklık farkını minimize eden örnek fonksiyon
    def temp_diff(x):
        return (x-20)**2 + 10
    res = minimize(temp_diff, x0=0)
    print(f"Minimum sıcaklık farkı: {res.fun}, x: {res.x}")
