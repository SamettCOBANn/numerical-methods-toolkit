"""
7. LU Decomposition
"""
import numpy as np
from scipy.linalg import lu, lu_solve, lu_factor

def demo():
    print("[7] LU Decomposition")
    A = np.array([[3, 2, -1], [2, -2, 4], [-1, 0.5, -1]])
    b = np.array([1, -2, 0])
    lu_, piv = lu_factor(A)
    x = lu_solve((lu_, piv), b)
    print(f"Çözüm (LU): {x}")
    P, L, U = lu(A)
    print("L matrisi:\n", L)
    print("U matrisi:\n", U)
