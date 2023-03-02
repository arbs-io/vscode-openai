#include<stdio.h>
#include<stdlib.h>

int main()
{
    int a = 12, b = 24;
    {
        int *sum = (int*)malloc(sizeof(int));
        *sum = a + b;
        printf("%d\n", *sum); // prints 36
    }
    printf("%d\n", *sum);
    return 0;
}