from cmath import exp, pi


def separate(a):
    b = a[1::2]
    a[:len(a) // 2] = a[::2]
    a[len(a) // 2:] = b[:]
    return a


def fft(a, start=0, n=None):
    n = n or len(a)
    if n > 1:
        a[start:start + n] = separate(a[start:start + n])
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
