# main.py
"""
Numerical Methods Toolkit ana scripti.
Her modül ayrı ayrı çalıştırılabilir veya topluca test edilebilir.
"""
from backend import (
    error_analysis, root_finding, interpolation, numerical_diff, numerical_integration,
    linear_systems, lu_decomposition, optimization, ode_solving, performance_error,
    visualization, comparative_analysis
)

def main():
    print("Numerical Methods Toolkit\n--------------------------")
    # Her modülün ana fonksiyonunu çağır
    error_analysis.demo()
    root_finding.demo()
    interpolation.demo()
    numerical_diff.demo()
    numerical_integration.demo()
    linear_systems.demo()
    lu_decomposition.demo()
    optimization.demo()
    ode_solving.demo()
    performance_error.demo()
    visualization.demo()
    comparative_analysis.demo()

if __name__ == "__main__":
    main()
