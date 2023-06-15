#include<stdio.h>
#include<stdlib.h>

int main()
{
    int *ptr = (int*)malloc(sizeof(int));
    *ptr = 15;
    printf("%d\n", *ptr);
    ptr = NULL;

    return 0;
}