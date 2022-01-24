import datetime
import stripe
from django.utils import timezone
from django.contrib import messages
from django.http import Http404, HttpResponseBadRequest
from django.core.exceptions import PermissionDenied, ValidationError, BadRequest
from rest_framework import viewsets, generics, mixins, status, decorators, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly

from crm_file_project.settings import EMAIL_HOST
from .custom_permission import IsOwnerOrReadOnly
from django.core.mail import send_mail

from .models import File, UserFilePermission
from .serializers import FileSerializer, UnpaidUserFileSerializer
# acct_1K81nkDpBU84I2ZU


class AllFIle(generics.ListAPIView):
    serializer_class = FileSerializer
    queryset = File.objects.all()
    lookup_field = 'slug'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return File.objects.all().exclude(user=self.request.user)
        return super().get_queryset()


class FileViewSets(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)
    queryset = File.objects.all()
    lookup_field = 'slug'

    # file.permitted_user.filter(userfilepermission__user=b, userfilepermission__expire_date__gte=datetime.now(
    # )).first()      UserFilePermission.objects.filter(user=b, file=file, expire_date__gte=datetime.now())

    def get_object(self):
        file_slug = self.kwargs[self.lookup_field]
        try:
            file = File.objects.get(slug=file_slug, user=self.request.user)
        except File.DoesNotExist:
            raise Http404
        return file

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @decorators.action(methods=['POST'], detail=True, url_path="share", permission_classes=[AllowAny])
    def share_file(self, request, slug=None):
        print(slug)
        stripe.api_key = "sk_test_51K84syADY9vArxrBzK3a5u6vNkXzr3pNkNaOJoZvauoCpaImKID9k9wkae0c0rWt7KXcjQUjQ2JL9vZDuCcXgI7y001iaSZY31"
        try:
            file = File.objects.get(slug=slug)
        except File.DoesNotExist:
            return Response({"Error": "File Not Found"}, status=status.HTTP_404_NOT_FOUND)

        if file.user == request.user:
            return Response({"Error": "You are the owner of this file, you dont need to buy it."},
                            status=status.HTTP_403_FORBIDDEN)
        if file.is_paid and file.expire_date >= timezone.now():
            return Response({"Error": "Already Paid"}, status=status.HTTP_403_FORBIDDEN)
        # try:
        #     UserFilePermission.objects.get(user=self.request.user, file=file, expire_date__gte=datetime.datetime.now())
        #     return Response({"Error": "You already have access of this product, you don't need to buy it."},
        #                     status=status.HTTP_403_FORBIDDEN)
        # except UserFilePermission.DoesNotExist:
        #     pass

        print(request.data['id'])
        payment_id = request.data['id']
        email = request.data['email']['email']
        customer_data = stripe.Customer.list(email=email).data

        if len(customer_data) == 0:
            customer = stripe.Customer.create(
                email=email, payment_method=payment_id)
        else:
            customer = customer_data[0]

        x = stripe.PaymentIntent.create(
            customer=customer,
            payment_method=payment_id,
            currency='usd',
            amount=int(file.price*100),
            confirm=True
        )

        stripe.api_key = "sk_test_51K81nkDpBU84I2ZU5Ea7qi9uyPbMva2w6OzwakBkwLKqH41RzqjmrdUUXTm8PptNFIjQY8d7tyHuD28pkB4G6zT600Xq1EVHcg"

        # tk = stripe.Token.create(
        #     card={
        #         "number": "4242424242424242",
        #         "exp_month": 12,
        #         "exp_year": 2022,
        #         "cvc": "314",
        #     },
        # )
        #
        # stripe.Charge.create(
        #     amount=200,
        #     currency="usd",
        #     source=tk,
        #     description="My First Test Charge (created for API docs)",
        # )
        # message = f"Dear {request.user.name}, you buy a product"
        # send_mail('Thank You For purchasing', message, EMAIL_HOST, [request.user.email, ])
        # perm = UserFilePermission.objects.create(user=request.user, file=file)
        file.is_paid = True
        file.expire_date = datetime.datetime.now() + datetime.timedelta(days=file.expire_days)
        file.save()

        return Response({"Success": "File Share Successfully"}, status=status.HTTP_200_OK)

    @decorators.action(methods=['POST'], detail=True, url_path="check", permission_classes=[AllowAny])
    def check_password(self, request, slug=None):
        password = request.data
        try:
            file = File.objects.get(slug=slug, file_password=password)
        except File.DoesNotExist:
            return Response({"Error": "File Not Found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = FileSerializer(file)
        return Response({"Success": serializer.data}, status=status.HTTP_200_OK)

    @decorators.action(methods=['POST'], detail=True, url_path="change")
    def change_password(self, request, slug=None):
        try:
            file = File.objects.get(slug=slug, user=request.user)
        except File.DoesNotExist:
            return Response({"Error": "File Not Found"}, status=status.HTTP_404_NOT_FOUND)

        password = request.data
        file.file_password = password
        file.save()
        return Response({"Success": "Successfully change"}, status=status.HTTP_200_OK)

    @decorators.action(methods=['GET'], detail=True, url_path="check_availability", permission_classes=[AllowAny])
    def check_availability(self, request, slug):
        try:
            file = File.objects.get(slug=slug)
        except File.DoesNotExist:
            return Response({"Error": "File Not Found"}, status=status.HTTP_404_NOT_FOUND)
        if not file.is_public and file.user != request.user:
            if not file.is_paid:
                return Response({"Error": "Please pay for buy"}, status=status.HTTP_403_FORBIDDEN)
            else:
                if file.expire_date <= timezone.now():
                    return Response({"Error": "Please pay for buy"}, status=status.HTTP_403_FORBIDDEN)
                return Response({"Error": "Please provide password"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = FileSerializer(file)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @decorators.action(methods=['GET'], detail=True, url_path="payment_availability", permission_classes=[AllowAny])
    def payment_availability(self, request, slug):
        try:
            file = File.objects.get(slug=slug)
        except File.DoesNotExist:
            return Response({"Error": "File Not Found"}, status=status.HTTP_404_NOT_FOUND)

        if file.is_paid and file.expire_date >= timezone.now():
            return Response({"Error": "Already Paid"}, status=status.HTTP_403_FORBIDDEN)
        elif file.is_public:
            return Response({"Error": "This file is public dont need to pay"}, status=status.HTTP_403_FORBIDDEN)
        elif file.user == request.user:
            return Response({"Error": "You dont need to pay for this"}, status=status.HTTP_403_FORBIDDEN)

        serializer = UnpaidUserFileSerializer(file)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateFileViewSets(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )
    queryset = File.objects.all()
    lookup_field = 'slug'

    def get_object(self):
        file_id = self.kwargs[self.lookup_field]
        try:
            file = File.objects.get(slug=file_id)
        except File.DoesNotExist:
            raise Http404

        if not file.is_public:
            try:
                File.objects.get(user=self.request.user, slug=file_id)
            except File.DoesNotExist:
                try:
                    UserFilePermission.objects.get(user=self.request.user, file=file, expire_date__gte=datetime.now())
                except UserFilePermission.DoesNotExist:
                    self.serializer_class = UnpaidUserFileSerializer
                except UserFilePermission.MultipleObjectsReturned:
                    pass
        return file

    def get_objects(self):
        file_id = self.kwargs[self.lookup_field]
        try:
            file = File.objects.get(slug=file_id)
        except File.DoesNotExist:
            raise Http404
        if not file.is_public:
            try:
                File.objects.get(user=self.request.user, slug=file_id)
            except File.DoesNotExist:
                try:
                    UserFilePermission.objects.get(user=self.request.user, file=file, expire_date__gte=datetime.now())
                except UserFilePermission.DoesNotExist:
                    raise PermissionDenied()
                except UserFilePermission.MultipleObjectsReturned:
                    pass
                except:
                    raise HttpResponseBadRequest
        return file
