"""
9. ODE Solving: Basit atmosfer modeli
"""
import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import solve_ivp

def demo():
    print("[9] ODE Solving")
    # dT/dt = -k*(T-T_env)
    def model(t, T):
        T_env = 20
        k = 0.1
        return -k*(T-T_env)
    t_span = (0, 50)
    T0 = [30]
    sol = solve_ivp(model, t_span, T0, t_eval=np.linspace(0, 50, 100))
    plt.plot(sol.t, sol.y[0], label='T(t)')
    plt.axhline(20, color='gray', linestyle='--', label='Çevre Sıcaklığı')
    plt.title('ODE ile Sıcaklık Değişimi')
    plt.legend()
    plt.show()
