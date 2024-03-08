from django.urls import path
from .views import (
    DistanceUnitListCreateView,
    DistanceUnitRetrieveUpdateDestroyView,
    UserAddCreditsView,
    EmissionEstimateCreateView,
    ViewableEmissionEstimatesListCreateView,
    ViewableEmissionEstimatesRetrieveDestroyView,
    UserListCreditsView,
    AllViewableEmissionEstimates
)

urlpatterns = [
    path('distance-units/', DistanceUnitListCreateView.as_view(), name='distance-unit-list-create'),
    path('distance-units/<int:pk>/', DistanceUnitRetrieveUpdateDestroyView.as_view(), name='distance-unit-retrieve-update-destroy'),
    path('user/add-credits/<int:pk>/', UserAddCreditsView.as_view(), name='user-add-credits'),
    path('user/credits/', UserListCreditsView.as_view(), name='user-list-credits'),
    path('emission-estimate/', EmissionEstimateCreateView.as_view(), name='emission-estimate-create'),
    path('viewable-emission-estimates/', ViewableEmissionEstimatesListCreateView.as_view(), name='viewable-emission-estimates-list-create'),
    path('viewable-emission-estimates/<int:pk>/', ViewableEmissionEstimatesRetrieveDestroyView.as_view(), name='viewable-emission-estimates-retrieve-destroy'),
    path('viewable-emission-estimates/all/', AllViewableEmissionEstimates.as_view(), name='all-viewable-emission-estimates'),
]
