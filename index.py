from cmath import exp, pi


def separate(a, start=0, n=None):
    """In-place decimation-in-time: evens->first half, odd->second half

    `start` and `n` (length) specify the view into `a`: this function will only modify the
    `a[start:start + n]` sub-section of `a`.
    """
    n = n or len(a)
    b = a[(start + 1):(start + n):2]
    a[start:(start + n // 2)] = a[start:(start + n):2]
    a[(start + n // 2):(start + n)] = b[:]


def fft(a, start=0, n=None):
    n = len(a) if n == None else n
    if n > 1:
        separate(a, start, n)
        fft(a, start, n // 2)
        fft(a, start + n // 2, n // 2)
        for k in range(n // 2):
            e = a[k + start]
            o = a[k + n // 2 + start]
            wo = exp(-2j * pi * k / n) * o
            a[k + start] = e + wo
            a[k + start + n // 2] = e - wo


if __name__ == '__main__':
    a = [0, 1, 2, 3, 4, 5, 6, 7]
    separate(a)
    print(a)

    x = [1.0 + 0j, 0j, 0j, 0j]
    fft(x)
    print(x)
