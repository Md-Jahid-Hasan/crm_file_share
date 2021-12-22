from datetime import datetime
import stripe
from django.http import Http404, HttpResponseBadRequest
from django.core.exceptions import PermissionDenied
from rest_framework import viewsets, generics, mixins, status, decorators, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from crm_file_project.settings import EMAIL_HOST
from .custom_permission import IsOwnerOrReadOnly
from django.core.mail import send_mail

from .models import File, UserFilePermission
from .serializers import FileSerializer
# acct_1K81nkDpBU84I2ZU



class FileViewSets(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)
    queryset = File.objects.all()

    # file.permitted_user.filter(userfilepermission__user=b, userfilepermission__expire_date__gte=datetime.now(
    # )).first()      UserFilePermission.objects.filter(user=b, file=file, expire_date__gte=datetime.now())

    def get_object(self):
        file_id = self.kwargs[self.lookup_field]

        try:
            file = File.objects.get(pk=file_id)
        except File.DoesNotExist:
            raise Http404

        if not file.is_public:
            try:
                File.objects.get(user=self.request.user, pk=file_id)
            except File.DoesNotExist:
                try:
                    UserFilePermission.objects.get(user=self.request.user, file=file, expire_date__gte=datetime.now())
                except UserFilePermission.DoesNotExist:
                    raise PermissionDenied()
                except UserFilePermission.MultipleObjectsReturned:
                    pass
                except:
                    raise HttpResponseBadRequest

        print(self.kwargs[self.lookup_field])
        return file

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @decorators.action(methods=['POST'], detail=True, url_path="share")
    def share_file(self, request, pk=None):
        stripe.api_key = "sk_test_51K84syADY9vArxrBzK3a5u6vNkXzr3pNkNaOJoZvauoCpaImKID9k9wkae0c0rWt7KXcjQUjQ2JL9vZDuCcXgI7y001iaSZY31"
        try:
            file = File.objects.get(pk=pk)
        except File.DoesNotExist:
            return Response({"Error": "File Not Found"}, status=status.HTTP_404_NOT_FOUND)

        if file.user == request.user:
            return Response({"Error": "You are the owner of this file, you dont need to buy it."},
                            status=status.HTTP_403_FORBIDDEN)

        payment_id = request.data
        print(payment_id)
        email = request.user.email
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
        message = f"Dear {request.user.name}, you buy a product"
        send_mail('Thank You For purchasing', message, EMAIL_HOST, [request.user.email, ])
        # UserFilePermission.objects.create(user=request.user, file=file)
        return Response({"Success": "File Share Successfully"}, status=status.HTTP_200_OK)
