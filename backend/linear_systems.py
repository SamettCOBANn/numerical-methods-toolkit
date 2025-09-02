"""
6. Solving Linear Systems
"""
import numpy as np

def demo():
    print("[6] Solving Linear Systems")
    A = np.array([[3, 2, -1], [2, -2, 4], [-1, 0.5, -1]])
    b = np.array([1, -2, 0])
    x = np.linalg.solve(A, b)
    print(f"Çözüm: {x}")
